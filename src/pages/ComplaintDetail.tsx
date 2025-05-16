import React from 'react';
import { useParams } from 'react-router-dom';
import ComplaintDetailComponent from '../components/complaints/ComplaintDetail';

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <ComplaintDetailComponent />
    </div>
  );
};

export default ComplaintDetail;