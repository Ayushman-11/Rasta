package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Bus struct {
	ID          string    `json:"id" bson:"_id"`
	UserID      string    `json:"user_id" bson:"user_id"`
	Route       string    `json:"route" bson:"route"`
	Coordinates []struct {
		Latitude  float64 `json:"latitude" bson:"latitude"`
		Longitude float64 `json:"longitude" bson:"longitude"`
	} `json:"coordinates" bson:"coordinates"`
	Crowd       string    `json:"crowd" bson:"crowd"`
	StartPoint  string    `json:"startPoint" bson:"startPoint"`
	Destination string    `json:"destination" bson:"destination"`
	Active      bool      `json:"active" bson:"active"`
	Timestamp   time.Time `json:"timestamp" bson:"timestamp"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for dev
	},
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan Bus)

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()
	clients[ws] = true

	for {
		var msg Bus
		err := ws.ReadJSON(&msg)
		if err != nil {
			delete(clients, ws)
			break
		}
	}
}

func handleBroadcast() {
	for {
		msg := <-broadcast
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	// Load .env
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	// MongoDB connection
	password := os.Getenv("MONGODB_PASSWORD")
	if password == "" {
		log.Fatal("MONGODB_PASSWORD not set")
	}
	connectionString := "mongodb+srv://transit_user:" + password + "@cluster0.7mcwslc.mongodb.net/?appName=Cluster0"
	client, err := mongo.Connect(options.Client().ApplyURI(connectionString))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.TODO())

	db := client.Database("transit_db")
	busesCollection := db.Collection("buses")

	r := gin.Default()

	// POST /share - Share bus journey
	r.POST("/share", func(c *gin.Context) {
		var bus Bus
		if err := c.ShouldBindJSON(&bus); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		bus.Active = true
		bus.Timestamp = time.Now()

		_, err := busesCollection.InsertOne(context.TODO(), bus)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save"})
			return
		}

		// Broadcast to WebSocket clients
		broadcast <- bus

		c.JSON(http.StatusOK, gin.H{"message": "Shared successfully"})
	})

	// GET /onboard - Get active onboard users
	r.GET("/onboard", func(c *gin.Context) {
		cursor, err := busesCollection.Find(context.TODO(), bson.M{"active": true})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch"})
			return
		}
		defer cursor.Close(context.TODO())

		var buses []Bus
		if err = cursor.All(context.TODO(), &buses); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode"})
			return
		}

		c.JSON(http.StatusOK, buses)
	})

	// WebSocket endpoint
	r.GET("/ws", func(c *gin.Context) {
		handleConnections(c.Writer, c.Request)
	})

	go handleBroadcast()

	r.Run(":8080")
}