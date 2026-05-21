pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    stages {

        // Stage 1: Checkout Code
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Stage 2: Install Dependencies
        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        // Stage 3: Build
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        // Stage 4: Run Unit Tests
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
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs above.'
        }
    }
}