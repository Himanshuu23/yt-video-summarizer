package main

import (
    "github.com/gin-gonic/gin"
)

func handle(c *gin.Context) {
    c.JSON(200, gin.H{
	"message":"from the server",
    })
}

func main() {
    router := gin.Default()
    router.GET("/", handle)

    router.Run("localhost:8000")
}
