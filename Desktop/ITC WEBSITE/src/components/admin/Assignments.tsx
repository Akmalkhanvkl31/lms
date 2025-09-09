import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import AssignmentModal from './AssignmentModal';
import { FaPlus, FaEdit, FaTrash, FaEye, FaClock, FaUsers, FaCheckCircle } from 'react-icons/fa';
import './Assignments.css';
import { Assignment } from '../../types';

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<import('../../types').Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          batches(name),
          submissions(id, status, student_id)
        `);

      if (error) throw error;
      setAssignments(data as Assignment[]);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = () => {
    setSelectedAssignment(null);
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDeleteAssignment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const { error } = await supabase
          .from('assignments')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  const getStatusColor = (status: 'published' | 'draft' | 'closed') => {
    switch (status) {
      case 'published': return 'status-published';
      case 'draft': return 'status-draft';
      case 'closed': return 'status-closed';
      default: return 'status-draft';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filterStatus === 'all') return true;
    return assignment.is_published === (filterStatus === 'published');
  });

  if (loading) {
    return <div className="assignments-loading">Loading assignments...</div>;
  }

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <div className="header-content">
          <h1 className="page-title">Assignment Management</h1>
          <p className="page-subtitle">Create, manage, and track student assignments</p>
        </div>
        <button className="btn-primary" onClick={handleCreateAssignment}>
          <FaPlus /> New Assignment
        </button>
      </div>

      <div className="assignments-filters">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Assignments</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="assignments-grid">
        {filteredAssignments.map(assignment => (
          <div key={assignment.id} className="assignment-card">
            <div className="card-header">
              <h3 className="assignment-title">{assignment.title}</h3>
              <span className={`assignment-status ${getStatusColor(assignment.is_published ? 'published' : 'draft')}`}>
                {assignment.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            
            <div className="card-content">
              <p className="assignment-description">{assignment.description}</p>
              
              <div className="assignment-meta">
                <div className="meta-item">
                  <FaUsers className="meta-icon" />
                  <span>{assignment.batches?.name || 'No Batch'}</span>
                </div>
                <div className="meta-item">
                  <FaClock className="meta-icon" />
                  <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <FaCheckCircle className="meta-icon" />
                  <span>{assignment.submissions?.length || 0} submissions</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="btn-icon btn-view"
                onClick={() => handleEditAssignment(assignment)}
                title="View Details"
              >
                <FaEye />
              </button>
              <button 
                className="btn-icon btn-edit"
                onClick={() => handleEditAssignment(assignment)}
                title="Edit Assignment"
              >
                <FaEdit />
              </button>
              <button 
                className="btn-icon btn-delete"
                onClick={() => handleDeleteAssignment(assignment.id)}
                title="Delete Assignment"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No assignments found</h3>
          <p>Create your first assignment to get started</p>
          <button className="btn-primary" onClick={handleCreateAssignment}>
            <FaPlus /> Create Assignment
          </button>
        </div>
      )}

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assignment={selectedAssignment}
        onSuccess={fetchAssignments}
      />
    </div>
  );
};

export default Assignments;
