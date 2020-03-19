import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { ToggleButtonGroup, ToggleButton, Table } from 'react-bootstrap';

const sorting = {
  ALPHABET: "alphabet",
  MARKS: "marks"
}

function sortStudents(students, sortType) {
  switch (sortType) {
    case sorting.ALPHABET:
      console.log("alpha");
      return students.sort((a, b) => a.studentName < b.studentName)
    
    case sorting.MARKS:
      console.log("marks");
      return students.sort((a, b) => a.markValue > b.markValue)
    
    default:
      console.log("default");
      return students.sort((a, b) => a.studentName < b.studentName)
  }
}

function JournalTable(props) {
  const [journals, setJournals] = useState([])
  useEffect(() => {
    fetch(`http://localhost:8080/api/journals?group_id=${props.groupId}`)
    .then(res => res.json())
    .then(res => setJournals(res))
    .catch(err => console.log(err))
  }, [props.groupId])
  return <Table bordered>
  <thead>
  <tr>
    <th>#</th>
    <th>ФИО</th>
    <th>Предмет</th>
    <th>Тип</th>
    <th>Оценка</th>
  </tr>
  </thead>
  <tbody>
    {journals.map((journal, index) => {
      return <tr>
      <td>{journal.journalId}</td>
      <td>{journal.studentSurname + ' ' + journal.studentName + ' ' + journal.studentSecondName}</td>
      <td>{journal.subjectName}</td>
      <td>{journal.examType}</td>
      <td>{journal.markName}</td>
      </tr>
    })}
  </tbody>
  </Table>
}

function StudentTable(props) {
  const [students, setStudents] = useState([])
  const [journals, setJournals] = useState([])
  useEffect(() => {
    fetch(`http://localhost:8080/api/students?group_id=${props.groupId}`)
    .then(res => res.json())
    .then(res => setStudents(res))
    .catch(err => console.log(err))

    fetch(`http://localhost:8080/api/journals?group_id=${props.groupId}`)
    .then(res => res.json())
    .then(res => setJournals(res))
    .catch(err => console.log(err))
  }, [props.groupId, props.sortType])
  return <Table bordered>
    <thead>
      <tr>
        <th>#</th>
        <th>ФИО</th>
        <th>Средний балл</th>
      </tr>
    </thead>
    <tbody>
      {sortStudents(students, props.sortType).map((student, index) => {
        const filteredStudents = journals.filter((journal) => journal.studentId == student.studentId);
        const reduced = filteredStudents.reduce((acc, cur) => {
          acc += parseInt(cur.markValue);
          return acc
        }, 0)
        const averageMark =  (reduced / filteredStudents.length) || '-';
        return <tr key={student.studentId}>
          <td>{student.studentId}</td>
          <td>{student.studentSurname + ' ' + student.studentName + ' ' + student.studentSecondName}</td>
          <td>{averageMark}
          </td>
        </tr>
      })}
    </tbody>
  </Table>
}

function GroupTable() {
  const [groups, setGroups] = useState([])
  const [groupId, setGroupId] = useState(1)
  const [sortType, setSortType] = useState(sorting.ALPHABET)
  useEffect(() => {
    fetch("http://localhost:8080/api/groups")
    .then(res => res.json())
    .then(res => setGroups(res))
  }, [groupId])
  const listGroups = groups.map((group) => {
    return <ToggleButton key={group.groupId} value={group.groupId}>{group.groupName}</ToggleButton>
  });
  return (
    <>
      <ToggleButtonGroup type="radio" name="group" value={groupId} onChange={setGroupId}>
        {listGroups}
      </ToggleButtonGroup>
      <JournalTable groupId={groupId}/>
      <ToggleButtonGroup type="radio" name="sort" value={sortType} onChange={setSortType}>
        <ToggleButton value={sorting.ALPHABET}>По алфавиту</ToggleButton>
        <ToggleButton value={sorting.MARKS}>По среднему баллу</ToggleButton>
      </ToggleButtonGroup>
      <StudentTable groupId={groupId} sortType={sortType}/>
    </>
  );
}

function App() {

  return (
    <div className="App">
      <GroupTable/>
    </div>
  );
}

export default App;
