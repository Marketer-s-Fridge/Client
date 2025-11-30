pipeline {
  agent any
  environment {
    REGISTRY = "docker.io/zzizi"
    IMAGE = "${REGISTRY}/mf-web"
    TAG = "latest"
    COMPOSE_DIR = "/home/ec2-user/app"

    NEXT_PUBLIC_KAKAO_REST_API_KEY = credentials('KAKAO_REST_API_KEY')
    NEXT_PUBLIC_KAKAO_REDIRECT_URI = 'http://marketersfridge.co.kr/login/kakao/callback'
  }
  stages {
    stage('Checkout'){ steps { checkout scm } }

    stage('Build Image'){ 
      steps { 
        sh """
          docker build \
            --build-arg NEXT_PUBLIC_KAKAO_REST_API_KEY=$NEXT_PUBLIC_KAKAO_REST_API_KEY \
            --build-arg NEXT_PUBLIC_KAKAO_REDIRECT_URI=$NEXT_PUBLIC_KAKAO_REDIRECT_URI \
            -t $IMAGE:$TAG .
        """
      } 
    }

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
        sshagent(['fridge']) {
          sh '''
          ssh ec2-user@15.165.137.5 "
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
