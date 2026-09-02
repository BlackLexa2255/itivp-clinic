#!/bin/bash
# Запуск: bash test-api.sh (сервер должен быть запущен)

BASE_URL="http://localhost:3000"

request() {
  local method=$1
  local path=$2
  local data=$3
  echo "=================================================================="
  echo ">>> $method $path"
  if [ -n "$data" ]; then
    echo ">>> Тело запроса: $data"
    curl -s -w "\n>>> HTTP-статус: %{http_code}\n" -X "$method" "$BASE_URL$path" \
      -H "Content-Type: application/json" -d "$data"
  else
    curl -s -w "\n>>> HTTP-статус: %{http_code}\n" -X "$method" "$BASE_URL$path"
  fi
  echo
}

echo "###################  РЕСУРС: ЗАПИСИ НА ПРИЁМ  ####################"
request GET "/api/appointments"
request GET "/api/appointments?status=scheduled"
request GET "/api/appointments/1"
request GET "/api/appointments/999"
request POST "/api/appointments" '{"patientId":1,"doctorName":"Козлов Игорь Львович","date":"2026-09-15","time":"11:00"}'
request POST "/api/appointments" '{}'

NEW_ID=$(curl -s -X POST "$BASE_URL/api/appointments" -H "Content-Type: application/json" \
  -d '{"patientId":2,"doctorName":"Козлов Игорь Львович","date":"2026-09-16","time":"12:00"}' \
  | sed -n 's/.*"id":\([0-9]*\).*/\1/p')

request PUT "/api/appointments/$NEW_ID" '{"patientId":2,"doctorName":"Козлов Игорь Львович","date":"2026-09-16","time":"13:30","status":"completed"}'
request PUT "/api/appointments/999" '{"patientId":1,"doctorName":"Нет Такого","date":"2026-09-16","time":"13:30"}'
request DELETE "/api/appointments/$NEW_ID"
request DELETE "/api/appointments/$NEW_ID"

echo "#####################  РЕСУРС: ПАЦИЕНТЫ  ########################"
request GET "/api/patients"
request GET "/api/patients/1"
request GET "/api/patients/999"
request POST "/api/patients" '{"fullName":"Новиков Денис Олегович","birthDate":"1995-07-19","medicalRecord":{"bloodType":"AB(IV) Rh+","allergies":[],"diagnoses":[]}}'
request POST "/api/patients" '{"birthDate":"1995-07-19"}'

PATIENT_ID=$(curl -s -X POST "$BASE_URL/api/patients" -H "Content-Type: application/json" \
  -d '{"fullName":"Временный Пациент","birthDate":"2000-01-01"}' \
  | sed -n 's/.*"id":\([0-9]*\).*/\1/p')

request PUT "/api/patients/$PATIENT_ID" '{"fullName":"Временный Пациент Изменённый","birthDate":"2000-01-01","medicalRecord":{"bloodType":"O(I) Rh+","allergies":["йод"],"diagnoses":[]}}'
request DELETE "/api/patients/$PATIENT_ID"

echo "##################  НЕИЗВЕСТНЫЙ МАРШРУТ  #######################"
request GET "/api/doctors"
