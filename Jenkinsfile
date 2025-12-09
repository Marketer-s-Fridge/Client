pipeline {
  agent any
  environment {
    REGISTRY = "docker.io/zzizi"
    IMAGE = "${REGISTRY}/mf-web"
    TAG = "latest"
    COMPOSE_DIR = "/home/ec2-user/app"

    NEXT_PUBLIC_KAKAO_REST_API_KEY = credentials('KAKAO_REST_API_KEY')
    NEXT_PUBLIC_KAKAO_REDIRECT_URI = 'https://marketersfridge.co.kr/login/kakao/callback'
    NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY = credentials('KAKAO_JAVASCRIPT_KEY')
  }
  stages {
    stage('Checkout'){ steps { checkout scm } }

    stage('Build Image'){ 
      steps { 
        sh """
          docker build \
            --build-arg NEXT_PUBLIC_KAKAO_REST_API_KEY=$NEXT_PUBLIC_KAKAO_REST_API_KEY \
            --build-arg NEXT_PUBLIC_KAKAO_REDIRECT_URI=$NEXT_PUBLIC_KAKAO_REDIRECT_URI \
            --build-arg NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=$NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY \
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
        # Jenkins 컨테이너에서 known_hosts 세팅
        mkdir -p ~/.ssh
        ssh-keyscan -H 15.165.137.5 >> ~/.ssh/known_hosts

        # EC2에 접속해서 docker-compose 실행
        ssh -o StrictHostKeyChecking=no ec2-user@15.165.137.5 "cd /home/ec2-user/app && docker-compose pull web && docker-compose up -d web"
      '''
        }
      }
    }
  }
}
