package main

import (
    "fmt"
    "net/http"

    "github.com/gin-gonic/gin"
)

type RequestBody struct {
    VideoUrl string `json:"VideoUrl"`
}

func handle(c *gin.Context) {
    c.JSON(200, gin.H{
	"message":"from the server",
    })
}

func summarize(c *gin.Context) {
    var body RequestBody
    
    if err := c.BindJSON(&body); err != nil {
	c.JSON(http.StatusBadRequest, gin.H{ "error": "Invalid JSON" })
	return
    }

    c.JSON(http.StatusOK, gin.H{
	"message": "Data recieved",
	"videoUrl": body.VideoUrl,
    })

    fmt.Println(body.VideoUrl)
}

func main() {
    router := gin.Default()
    
    router.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(http.StatusNoContent)
            return
        }
        c.Next()
    })
    
    router.GET("/", handle)
    router.POST("/summarize", summarize)

    router.Run("localhost:8000")
}
