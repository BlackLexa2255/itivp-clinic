// Хранилище пациентов. Электронная карта пациента — вложенный объект medicalRecord.
// Как и записи на приём, данные пока лежат в массиве в памяти сервера.

let patients = [
  {
    id: 1,
    fullName: 'Иванов Иван Иванович',
    birthDate: '1990-05-14',
    phone: '+375291234567',
    medicalRecord: {
      bloodType: 'A(II) Rh+',
      allergies: ['пенициллин'],
      diagnoses: ['ОРВИ']
    }
  },
  {
    id: 2,
    fullName: 'Ковалёва Мария Петровна',
    birthDate: '1985-11-02',
    phone: '+375447654321',
    medicalRecord: {
      bloodType: 'O(I) Rh-',
      allergies: [],
      diagnoses: ['гипертония']
    }
  },
  {
    id: 3,
    fullName: 'Смирнов Алексей Викторович',
    birthDate: '2001-03-27',
    phone: '+375339876543',
    medicalRecord: {
      bloodType: 'B(III) Rh+',
      allergies: ['пыльца'],
      diagnoses: []
    }
  }
];

// Счётчик для выдачи id новым пациентам
let nextId = 4;

function findAll() {
  return patients;
}

// Один пациент по id (undefined, если такого нет)
function findById(id) {
  return patients.find(patient => patient.id === id);
}

function create(data) {
  const patient = {
    id: nextId++,
    fullName: data.fullName,
    birthDate: data.birthDate,
    phone: data.phone || '',
    medicalRecord: data.medicalRecord || { bloodType: '', allergies: [], diagnoses: [] }
  };
  patients.push(patient);
  return patient;
}

// Полная замена полей пациента (PUT). Возвращает undefined, если пациента нет
function update(id, data) {
  const patient = findById(id);
  if (!patient) {
    return undefined;
  }
  patient.fullName = data.fullName;
  patient.birthDate = data.birthDate;
  patient.phone = data.phone || '';
  patient.medicalRecord = data.medicalRecord || { bloodType: '', allergies: [], diagnoses: [] };
  return patient;
}

// true — пациент удалён, false — пациента с таким id не было
function remove(id) {
  const index = patients.findIndex(patient => patient.id === id);
  if (index === -1) {
    return false;
  }
  patients.splice(index, 1);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
