let appointments = [
  {
    id: 1,
    patientId: 1,
    doctorName: 'Петров Пётр Петрович',
    specialty: 'терапевт',
    date: '2026-09-10',
    time: '10:30',
    status: 'scheduled'
  },
  {
    id: 2,
    patientId: 2,
    doctorName: 'Сидорова Анна Сергеевна',
    specialty: 'кардиолог',
    date: '2026-09-11',
    time: '09:00',
    status: 'completed'
  },
  {
    id: 3,
    patientId: 3,
    doctorName: 'Петров Пётр Петрович',
    specialty: 'терапевт',
    date: '2026-09-12',
    time: '14:15',
    status: 'cancelled'
  }
];

let nextId = 4;

function findAll(status) {
  if (status) {
    return appointments.filter(appointment => appointment.status === status);
  }
  return appointments;
}

function findById(id) {
  return appointments.find(appointment => appointment.id === id);
}

function create(data) {
  const appointment = {
    id: nextId++,
    patientId: Number(data.patientId),
    doctorName: data.doctorName,
    specialty: data.specialty || '',
    date: data.date,
    time: data.time,
    status: data.status || 'scheduled'
  };
  appointments.push(appointment);
  return appointment;
}

function update(id, data) {
  const appointment = findById(id);
  if (!appointment) {
    return undefined;
  }
  appointment.patientId = Number(data.patientId);
  appointment.doctorName = data.doctorName;
  appointment.specialty = data.specialty || '';
  appointment.date = data.date;
  appointment.time = data.time;
  appointment.status = data.status || 'scheduled';
  return appointment;
}

function remove(id) {
  const index = appointments.findIndex(appointment => appointment.id === id);
  if (index === -1) {
    return false;
  }
  appointments.splice(index, 1);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
