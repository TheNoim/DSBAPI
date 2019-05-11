workflow "Run daily tests" {
  on = "schedule(20 0 * * *)"
}
