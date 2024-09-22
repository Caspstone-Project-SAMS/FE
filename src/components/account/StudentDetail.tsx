import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { StudentService } from '../../hooks/StudentList';
import type { StudentDetail } from '../../models/student/Student';
import { Divider, Empty } from 'antd';
import { BsFingerprint } from 'react-icons/bs';

// STYLES
const styles = {
  details: {
    padding: '0.5rem 1rem',
    borderBottom: '1px solid #e1e1e1',
  },
  value: {
    padding: '0.5rem 1rem',
    borderTop: '1px solid #e1e1e1',
    color: '#899499',
  },
  templateCard: {
    padding: '0.5rem',
    margin: '0.5rem',
    border: '1px solid #e1e1e1',
    borderRadius: '4px',
    width: 'calc(50% - 1rem)',
  },
  templateContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
  },
};

// APP
export default function StudentDetail(props: any) {
  const userId = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.studentID,
  );
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (userId) {
        try {
          setLoading(true);
          const data = await StudentService.getStudentByID(userId);
          if (data) {
            setStudent(data);
          }
        } catch (error) {
          console.error('Failed to fetch student details:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudentDetails();
  }, [userId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!student) {
    return <Typography>No student data available</Typography>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getGenderText = (gender: number): string => {
    switch (gender) {
      case 1:
        return 'Male';
      case 2:
        return 'Female';
      case 3:
        return 'Others';
      default:
        return 'N/A';
    }
  };

  const {
    displayName,
    address,
    dob,
    email,
    phoneNumber,
    fingerprintTemplates,
  } = student.result;
  console.log('svsdvgsdzvgsz', props.user);
  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      style={{ padding: '0.5rem', marginBottom: -50 }}
    >
      <Grid item xs={12}>
        <Typography variant="body1" style={styles.details}>
          <strong>First Name:</strong> {props.firstName || 'N/A'}
        </Typography>
        <Typography variant="body1" style={styles.details}>
          <strong>Last Name:</strong> {props.lastName || 'N/A'}
        </Typography>
        <Typography variant="body1" style={styles.details}>
          <strong>Full Name:</strong> {props.fullName || 'N/A'}
        </Typography>
        <Typography variant="body1" style={styles.details}>
          <strong>Gender:</strong>{' '}
          {props.gender === 1
            ? 'Male'
            : props.gender === 2
            ? 'Female'
            : props.gender === 3
            ? 'Others'
            : 'N/A'}
        </Typography>
        <Typography variant="body1" style={styles.details}>
          <strong>Email:</strong> {email || 'N/A'}
        </Typography>
        <Typography variant="body1" style={styles.details}>
          <strong>Phone:</strong> {phoneNumber || 'N/A'}
        </Typography>
        <Typography variant="body1" style={styles.details}>
          <strong>Address:</strong> {address || 'N/A'}
        </Typography>
        <Typography variant="body1" style={styles.details}>
          <strong>Date of Birth:</strong> {formatDate(dob) || 'N/A'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider>
          {' '}
          <Typography
            variant="h6"
            style={{ margin: '0.5rem 0', marginLeft: '0.5rem' }}
          >
            Fingerprint Templates
          </Typography>
        </Divider>
        <div style={styles.templateContainer}>
          {fingerprintTemplates && fingerprintTemplates.length > 0 ? (
            fingerprintTemplates.slice(0, 2).map((template) => (
              <Card
                style={styles.templateCard}
                key={template.fingerprintTemplateID}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <Typography variant="body1">
                      <strong>Status:</strong>{' '}
                      <span
                        style={{
                          color:
                            template.status === 1
                              ? 'green'
                              : template.status === 2
                              ? 'red'
                              : 'inherit',
                        }}
                      >
                        {template.status === 1
                          ? 'Available'
                          : template.status === 2
                          ? 'Unavailable'
                          : ''}
                      </span>
                    </Typography>
                    <Typography variant="body1">
                      <strong>Created At:</strong>{' '}
                      {formatDate(template.createdAt)}
                    </Typography>
                  </div>
                  <div className="card-icon">
                    <BsFingerprint size={30} />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Empty description="No fingerprint templates available." />
          )}
        </div>
      </Grid>
    </Grid>
  );
}
