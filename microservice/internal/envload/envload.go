package envload

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func Load() {
	for _, path := range []string{".env", "../backend/.env", "backend/.env", "microservice/.env"} {
		if _, err := os.Stat(path); err != nil {
			continue
		}
		if err := godotenv.Load(path); err != nil {
			log.Printf("envload: skip %s: %v", path, err)
			continue
		}
		log.Printf("envload: loaded %s", path)
		return
	}
	log.Println("envload: no .env found, using system environment")
}
