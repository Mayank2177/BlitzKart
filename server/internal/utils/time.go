package utils

import (
	"time"
)

// FormatDateTime formats a time to a standard datetime string
func FormatDateTime(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

// FormatDate formats a time to a standard date string
func FormatDate(t time.Time) string {
	return t.Format("2006-01-02")
}

// ParseDateTime parses a datetime string
func ParseDateTime(s string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04:05", s)
}

// ParseDate parses a date string
func ParseDate(s string) (time.Time, error) {
	return time.Parse("2006-01-02", s)
}

// IsExpired checks if a time has expired
func IsExpired(t time.Time) bool {
	return time.Now().After(t)
}

// DaysBetween calculates the number of days between two dates
func DaysBetween(start, end time.Time) int {
	duration := end.Sub(start)
	return int(duration.Hours() / 24)
}

// StartOfDay returns the start of the day for a given time
func StartOfDay(t time.Time) time.Time {
	year, month, day := t.Date()
	return time.Date(year, month, day, 0, 0, 0, 0, t.Location())
}

// EndOfDay returns the end of the day for a given time
func EndOfDay(t time.Time) time.Time {
	year, month, day := t.Date()
	return time.Date(year, month, day, 23, 59, 59, 999999999, t.Location())
}
