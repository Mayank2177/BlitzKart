package utils

import (
	"log"
	"os"
)

// Logger levels
const (
	INFO  = "INFO"
	WARN  = "WARN"
	ERROR = "ERROR"
	DEBUG = "DEBUG"
)

var (
	infoLogger  *log.Logger
	warnLogger  *log.Logger
	errorLogger *log.Logger
	debugLogger *log.Logger
)

func init() {
	infoLogger = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	warnLogger = log.New(os.Stdout, "WARN: ", log.Ldate|log.Ltime|log.Lshortfile)
	errorLogger = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
	debugLogger = log.New(os.Stdout, "DEBUG: ", log.Ldate|log.Ltime|log.Lshortfile)
}

// LogInfo logs an info message
func LogInfo(message string) {
	infoLogger.Println(message)
}

// LogWarn logs a warning message
func LogWarn(message string) {
	warnLogger.Println(message)
}

// LogError logs an error message
func LogError(message string, err error) {
	if err != nil {
		errorLogger.Printf("%s: %v\n", message, err)
	} else {
		errorLogger.Println(message)
	}
}

// LogDebug logs a debug message
func LogDebug(message string) {
	debugLogger.Println(message)
}
