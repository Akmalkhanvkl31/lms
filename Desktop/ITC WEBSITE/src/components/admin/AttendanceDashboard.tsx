import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Attendance, Student, Batch } from '../../types';

const AttendanceDashboard: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: batchesData, error: batchesError } = await supabase.from('batches').select('*');
      if (batchesError) console.error('Error fetching batches:', batchesError);
      else setBatches(batchesData || []);

      const { data: studentsData, error: studentsError } = await supabase.from('students').select('*');
      if (studentsError) console.error('Error fetching students:', studentsError);
      else setStudents(studentsData || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBatch && selectedDate) {
      const fetchAttendance = async () => {
        const { data, error } = await supabase
          .from('attendance')
          .select('*')
          .eq('batch_id', selectedBatch)
          .eq('date', selectedDate);
        if (error) console.error('Error fetching attendance:', error);
        else setAttendanceRecords(data || []);
      };
      fetchAttendance();
    }
  }, [selectedBatch, selectedDate]);

  const handleMarkAttendance = async (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    const record = {
      student_id: studentId,
      batch_id: selectedBatch,
      date: selectedDate,
      status: status,
    };

    const { data, error } = await supabase.from('attendance').upsert(record).select();
    if (error) {
      console.error('Error marking attendance:', error);
    } else if (data) {
      setAttendanceRecords(prev => {
        const existingRecordIndex = prev.findIndex(ar => ar.studentId === studentId);
        if (existingRecordIndex > -1) {
          const updatedRecords = [...prev];
          updatedRecords[existingRecordIndex] = data[0];
          return updatedRecords;
        }
        return [...prev, data[0]];
      });
    }
  };

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.fullName || 'Unknown Student';
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">Attendance Monitoring</h2>
      
      <div className="flex gap-4 mb-6">
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="">Select a Batch</option>
          {batches.map(batch => (
            <option key={batch.id} value={batch.id}>{batch.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700"
        />
      </div>

      {selectedBatch && selectedDate && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Attendance for {batches.find(b => b.id === selectedBatch)?.name} on {selectedDate}
          </h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3">Student</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(s => s.batchId === selectedBatch)
                .map(student => {
                  const attendance = attendanceRecords.find(ar => ar.studentId === student.id);
                  return (
                    <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="p-3">{getStudentName(student.id)}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          attendance?.status === 'present' ? 'bg-green-500/30 text-green-300' :
                          attendance?.status === 'absent' ? 'bg-red-500/30 text-red-300' :
                          attendance?.status === 'late' ? 'bg-yellow-500/30 text-yellow-300' :
                          attendance?.status === 'excused' ? 'bg-blue-500/30 text-blue-300' :
                          'bg-gray-500/30 text-gray-300'
                        }`}>
                          {attendance?.status || 'Not Marked'}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => handleMarkAttendance(student.id, 'present')} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Present</button>
                        <button onClick={() => handleMarkAttendance(student.id, 'absent')} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Absent</button>
                        <button onClick={() => handleMarkAttendance(student.id, 'late')} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded">Late</button>
                        <button onClick={() => handleMarkAttendance(student.id, 'excused')} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Excused</button>
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
