# DSO101 — Continuous Integration and Continuous Deployment
## Assignment II: Jenkins CI/CD Pipeline for Node.js To-Do Application

**Student:** Sangay Wangchuk  
**Student ID:** 02250367  
**Course:** DSO101 — Continuous Integration and Deployment  
**GitHub Repo:** https://github.com/SWangchuk676/SangayWangchuk_02250367_DSO101_A2

## 1. Aim

The aim of this assignment is to configure a Jenkins CI/CD pipeline to automate the build, test, and deployment processes of a Node.js To-Do List application. The pipeline covers:

- Code checkout from GitHub
- Dependency installation using npm
- Build step
- Unit testing using Jest with JUnit report publishing in Jenkins

## 2. Theory

### 2.1 Continuous Integration (CI)
Continuous Integration is a software development practice where developers frequently merge code changes into a shared repository, after which automated builds and tests are triggered. The goal is to detect integration errors early and keep the codebase in a consistently working state, eliminating the "integration hell" that occurs when developers work in isolation for too long before merging.

### 2.2 Continuous Deployment (CD)
Continuous Deployment extends CI by automatically releasing every code change that passes all pipeline stages to a staging or production environment without manual intervention. This allows teams to deliver software updates rapidly and reliably.

### 2.3 Jenkins
Jenkins is an open-source automation server widely used for CI/CD pipelines. It is built on Java and supports hundreds of plugins for building, deploying, and automating projects. Jenkins supports pipeline-as-code through a `Jenkinsfile` — a versioned text file checked into source control alongside the application code — enabling reproducible and auditable builds.

### 2.4 Jest Testing Framework
Jest is a JavaScript testing framework developed by Meta, designed for Node.js and React applications. It provides a zero-configuration testing experience with built-in assertions, mocking, and coverage reporting. In this assignment, `jest-junit` is used alongside Jest to generate a `junit.xml` report that Jenkins can parse and display as a visual test report.

### 2.5 GitHub and Version Control
GitHub is a cloud-based platform for hosting Git repositories. In this pipeline, GitHub acts as the source code repository from which Jenkins fetches the latest code using a Personal Access Token (PAT) for secure authentication.

## 3. Tools and Technologies

| Tool | Purpose |
|------|---------|
| Jenkins | CI/CD pipeline automation |
| GitHub | Source code hosting |
| Node.js & npm | JavaScript runtime and package management |
| Jest | Unit testing framework |
| jest-junit | Generates JUnit XML reports for Jenkins |
| Git | Version control |

## 4. Implementation Steps

### Step 1 — Project Setup

A fresh Node.js project was initialized in a new folder:

```bash
mkdir todo-app
cd todo-app
npm init -y
```

The core application logic was written in `app.js` with four functions: `addTodo()`, `getTodos()`, `completeTodo()`, and `deleteTodo()`. A `clearTodos()` helper was also added for test isolation.

```js
// app.js
const todos = [];

function addTodo(task) {
  if (!task || task.trim() === '') throw new Error('Task cannot be empty');
  const todo = { id: todos.length + 1, task: task.trim(), done: false };
  todos.push(todo);
  return todo;
}

function getTodos() { return todos; }

function completeTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) throw new Error('Todo not found');
  todo.done = true;
  return todo;
}

function deleteTodo(id) {
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Todo not found');
  return todos.splice(index, 1)[0];
}

function clearTodos() { todos.length = 0; }

module.exports = { addTodo, getTodos, completeTodo, deleteTodo, clearTodos };
```

---

### Step 2 — Install Jest and Configure package.json

Jest and jest-junit were installed as development dependencies:

```bash
npm install --save-dev jest jest-junit
```

The `package.json` scripts and jest-junit config were updated:

```json
"scripts": {
  "test": "jest --ci --reporters=default --reporters=jest-junit",
  "build": "echo Building app..."
},
"jest-junit": {
  "outputDirectory": ".",
  "outputName": "junit.xml"
}
```

---

### Step 3 — Write Unit Tests

Five unit tests were written in `tests/app.test.js`:

```js
const { addTodo, getTodos, completeTodo, deleteTodo, clearTodos } = require('../app');

beforeEach(() => { clearTodos(); });

test('should add a new todo', () => {
  const todo = addTodo('Buy groceries');
  expect(todo.task).toBe('Buy groceries');
  expect(todo.done).toBe(false);
});

test('should get all todos', () => {
  addTodo('Task 1');
  addTodo('Task 2');
  expect(getTodos().length).toBe(2);
});

test('should complete a todo', () => {
  const todo = addTodo('Do laundry');
  expect(completeTodo(todo.id).done).toBe(true);
});

test('should delete a todo', () => {
  const todo = addTodo('Clean room');
  deleteTodo(todo.id);
  expect(getTodos().length).toBe(0);
});

test('should throw error for empty task', () => {
  expect(() => addTodo('')).toThrow('Task cannot be empty');
});
```

All five tests passed locally before proceeding with Jenkins:

```
PASS  tests/app.test.js
  ✓ should add a new todo (2 ms)
  ✓ should get all todos
  ✓ should complete a todo
  ✓ should delete a todo
  ✓ should throw error for empty task (11 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

---

### Step 4 — Create the Jenkinsfile

A `Jenkinsfile` was created in the repository root. Since the environment is **Windows**, `bat` was used instead of `sh`:

```groovy
pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install') {
            steps {
                bat 'npm install'
            }
        }
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        stage('Test') {
            steps {
                bat 'npm test'
            }
            post {
                always {
                    junit 'junit.xml'
                }
            }
        }
    }
    post {
        success { echo 'Pipeline completed successfully!' }
        failure { echo 'Pipeline failed. Check the logs above.' }
    }
}
```

---

### Step 5 — GitHub Repository Setup

All project files were pushed to a new public GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit - todo app with Jenkinsfile"
git branch -M main
git remote add origin https://github.com/SWangchuk676/SangayWangchuk_02250367_DSO101_A2.git
git push -u origin main
```

A GitHub Personal Access Token (PAT) was generated with `repo` and `admin:repo_hook` permissions and stored in Jenkins credentials as `github-creds`.

---

### Step 6 — Jenkins Plugin Installation

The following plugins were installed via **Manage Jenkins > Plugins > Available**:

| Plugin | Purpose |
|--------|---------|
| NodeJS Plugin | Enables Node.js/npm in pipeline |
| Pipeline | Enables Jenkinsfile declarative pipeline |
| GitHub Integration | GitHub webhook and PAT credential support |

Node.js LTS v20.x was configured in **Manage Jenkins > Tools > NodeJS Installations** with the name `NodeJS`, matching the `tools` block in the Jenkinsfile.

---

### Step 7 — Create and Run the Pipeline Job

A new Pipeline job named `todo-app-pipeline` was created with the following configuration:

- **Definition:** Pipeline script from SCM
- **SCM:** Git
- **Repository URL:** `https://github.com/SWangchuk676/SangayWangchuk_02250367_DSO101_A2.git`
- **Credentials:** GitHub PAT (`github-creds`)
- **Branch Specifier:** `*/main`
- **Script Path:** `Jenkinsfile`

The pipeline was triggered using **Build Now**. Build **#2** completed successfully in **1 minute 50 seconds**.

---

## 5. Pipeline Results

### Pipeline Execution — Build #2

| Stage | Status | Description |
|-------|--------|-------------|
| Checkout | Passed | Code fetched from GitHub main branch |
| Install |  Passed | npm install completed successfully |
| Build |  Passed | Build script executed |
| Test |  Passed | All 5 Jest tests passed, junit.xml published |

### Test Results

| Test Case | Result |
|-----------|--------|
| should add a new todo | PASS |
| should get all todos |  PASS |
| should complete a todo |  PASS |
| should delete a todo |  PASS |
| should throw error for empty task |  PASS |

**Total: 5 passed, 0 failed**

> Jenkins Test Result Trend showed 5 passed tests with no failures across Build #2.

## 6. Conclusion

This assignment provided comprehensive hands-on experience in setting up a complete CI/CD pipeline using Jenkins for a Node.js application. The key learnings from this exercise include:

- **CI/CD Principles** — Understanding how automation improves software delivery by eliminating manual, error-prone build and test processes.
- **Pipeline-as-Code** — Writing a declarative `Jenkinsfile` that defines the entire pipeline in version-controlled source code.
- **Jenkins Configuration** — Installing plugins, configuring Node.js tools, and managing GitHub credentials securely within Jenkins.
- **Unit Testing with Jest** — Writing isolated unit tests and generating JUnit-compatible reports for Jenkins to visualize.
- **Windows Compatibility** — Understanding the difference between `sh` (Linux/Mac) and `bat` (Windows) in Jenkinsfile pipeline scripts.

### Challenges Faced

1. **Git Push Rejected** — When first pushing to GitHub, the remote had an auto-generated README that conflicted with local history. This was resolved by running:
   ```bash
   git pull origin main --allow-unrelated-histories
   ```

2. **Windows Shell Commands** — The Jenkinsfile initially failed because `sh` commands are not supported on Windows Jenkins agents. All shell commands were replaced with `bat`.

3. **JUnit Report Configuration** — The `jest-junit` package required explicit configuration in `package.json` to output `junit.xml` in the correct directory so Jenkins could locate and publish the test results.

---

## 7. References

- Jenkins. (2024). *Jenkins User Documentation*. https://www.jenkins.io/doc/
- Meta Open Source. (2024). *Jest: Delightful JavaScript Testing*. https://jestjs.io/
- GitHub Inc. (2024). *Managing your personal access tokens*. https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
- npm. (2024). *jest-junit*. https://www.npmjs.com/package/jest-junit
- Fowler, M. (2006). *Continuous Integration*. https://martinfowler.com/articles/continuousIntegration.html