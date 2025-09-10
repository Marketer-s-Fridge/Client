pipeline {
  agent any
  environment {
    REGISTRY = "docker.io/zzizi"
    IMAGE = "${REGISTRY}/mf-web"
    TAG = "latest"
    COMPOSE_DIR = "/home/ec2-user/app"
  }
  stages {
    stage('Checkout'){ steps { checkout scm } }
    stage('Build Image'){ steps { sh 'docker build -t $IMAGE:$TAG .' } }
    stage('Push Image'){
      steps {
        withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CRED',
          usernameVariable: 'U', passwordVariable: 'P')]) {
          sh 'echo $P | docker login -u $U --password-stdin'
          sh 'docker push $IMAGE:$TAG'
        }
      }
    }
    stage('Deploy'){
      steps {
        sshagent(['fridge']) {   // 👈 여기 ID를 fridge로 교체
          sh '''
          ssh ec2-user@44.203.45.0 "
            cd $COMPOSE_DIR &&
            docker-compose pull web &&
            docker-compose up -d web
          "
          '''
        }
      }
    }
  }
}
