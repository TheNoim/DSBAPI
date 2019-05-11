workflow "Run daily tests" {
  on = "schedule(20 0 * * *)"
  resolves = ["Run Tests"]
}

action "Install" {
  uses = "Borales/actions-yarn@master"
  args = "install"
}

action "Run Tests" {
  uses = "Borales/actions-yarn@master"
  needs = ["not-tag-filter", "Install"]
  args = "test"
  secrets = ["DSBUSERNAME", "PASSWORD"]
}

workflow "Test on Push" {
  on = "push"
  resolves = ["Run Tests"]
}

workflow "Run Test on pull request" {
  resolves = ["Run Tests"]
  on = "pull_request"
}

workflow "Release" {
  resolves = ["Publish"]
  on = "push"
}

action "Publish" {
  uses = "Borales/actions-yarn@master"
  needs = ["Install", "Update Docs"]
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}

action "Generate Docs" {
  uses = "Borales/actions-yarn@master"
  needs = ["tag-filter"]
  args = "generate-doc"
}

action "Update Docs" {
  needs = ["Generate Docs"]
  uses = "maxheld83/ghpages@v0.2.1"
  env = {
    BUILD_DIR = "docs/"
  }
  secrets = ["GH_PAT"]
}

action "tag-filter" {
  uses = "actions/bin/filter@master"
  args = "tag"
}

action "not-tag-filter" {
  uses = "actions/bin/filter@master"
  args = "not tag"
}
