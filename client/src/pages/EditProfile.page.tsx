import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { register } from '@/api/user';
import { Layout, useStyles } from '@/components/layout';
import { base } from '@/api/base';

interface User {
  ID: string,
	Firstname: string,
	Lastname: string,
  Password: string,
	Organization: string,
	FieldOfStudy: string,
	JobTitle: string,
  SocialLinks: Array<String>,
}

export function EditProfilePage() {
  const styles = useStyles();

  const [userProfile, setUserProfile] = useState<User>({
    ID: '',
    Firstname: '',
    Lastname: '',
    Password: '',
    Organization: '',
    FieldOfStudy: '',
    JobTitle: '',
    SocialLinks: [],
  });

  const [error, setError] = useState('');
  const [changePassword, setChangePassword] = useState(false)

  const token = localStorage.getItem('token')
  const email = localStorage.getItem('email')

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfileData = await fetch(`http://${base}/getUserProfile/${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      // Check if the response is ok
      if (!userProfileData.ok) {
        throw new Error('Error in the response');
      }

      const getUserProfileData = await userProfileData.json();
      setUserProfile(getUserProfileData);
    }

    fetchUserProfile();
  }, [])

  const handleEditProfile = (field: keyof User, value: string) => {
    setUserProfile((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleEditSocialLink = (index: number, value: string) => {
    const updatedSocialLinks = [...userProfile.SocialLinks];
    updatedSocialLinks[index] = value;

    setUserProfile((prevData) => ({
      ...prevData,
      SocialLinks: updatedSocialLinks,
    }));
  };

  const handleAddSocialLink = () => {
    setUserProfile((prevData) => ({
      ...prevData,
      SocialLinks: [...prevData.SocialLinks, ''],
    }));
  };

  const handleRemoveSocialLink = (index: number) => {
    const updatedSocialLinks = userProfile.SocialLinks.filter((_, i) => i !== index);

    setUserProfile((prevData) => ({
      ...prevData,
      SocialLinks: updatedSocialLinks,
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const password = userProfile.Password
    const organization = userProfile.Organization
    const fieldOfStudy = userProfile.FieldOfStudy
    const jobTitle = userProfile.JobTitle
    const getSocialLinks = userProfile.SocialLinks


    const socialLinks = getSocialLinks.filter(socialLink => socialLink !== "");
    
    const response = await fetch(`http://${base}/editProfile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, organization, fieldOfStudy, jobTitle, socialLinks }),
    })

    const data = await response.json();

    if (response.ok) {
      alert('Profile updated successfully!');
    } else {
      alert(`Error: ${data.message}`);
    }
  }

  const handleChangePassword = () => {
    setChangePassword(true)
  }

  const handleCancel = () => {
    setChangePassword(false)
    userProfile.Password = ""
  }

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>
      
      <Container size="sm" mt={30}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>
          Edit Your Profile
        </Title>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {userProfile != null && (
          <Paper
            withBorder
            shadow="md"
            p={30}
            mt={30}
            radius="md"
            style={{ backgroundColor: '#fff' }}
          >
            <Group grow mb="md">
              <Box mt="md">
                <Text size="sm" style={{ fontWeight: 600 }}>
                  Your firstname
                </Text>
                <Text size="sm">{userProfile.Firstname}</Text>
              </Box>

              <Box mt="md">
                <Text size="sm" style={{ fontWeight: 600 }}>
                  Your lastname
                </Text>
                <Text size="sm">{userProfile.Lastname}</Text>
              </Box>
            </Group>

            <Box mt="md">
              <Text size="sm" style={{ fontWeight: 600 }}>
                Your email address
              </Text>
              <Text size="sm">{email}</Text>
            </Box>

            <Box mt="md">
              <Text size="sm" style={{ fontWeight: 600 }}>Change Password</Text>
              {changePassword == false ? (
                <Button 
                  size="xs"
                  mt={5}
                  style={styles.secondaryButton}
                  onClick={handleChangePassword}
                >
                  Change Password
                </Button>
              ) : (
                <Group mb="sm">
                  <PasswordInput
                    placeholder="Your password"
                    mt={5}
                    value={userProfile.Password}
                    onChange={(event) => handleEditProfile('Password', event.target.value)}
                    required
                    styles={{ input: styles.input }}
                    style={{ width: '500px' }}
                  />

                  <Button color="red" size="xs" onClick={handleCancel}>Cancel</Button>
                </Group>
              )}
            </Box>

            <TextInput
              label="Institution/organization you work at"
              placeholder='Institution name (or "Independent")'
              mt="md"
              value={userProfile.Organization || ""}
              onChange={(event) => handleEditProfile('Organization', event.target.value)}
              styles={{ input: styles.input }}
            />

            <TextInput
              label="Your field of study"
              placeholder="e.g., Computer Science, Biology"
              mt="md"
              value={userProfile.FieldOfStudy || ""}
              onChange={(event) => handleEditProfile('FieldOfStudy', event.target.value)}
              required
              styles={{ input: styles.input }}
            />

            <TextInput
              label="Your job title"
              placeholder="e.g., Researcher, Professor"
              mt="md"
              value={userProfile.JobTitle || ""}
              onChange={(event) => handleEditProfile('JobTitle', event.target.value)}
              styles={{ input: styles.input }}
            />

            <Box mt="md">
              <Text size="sm" style={{ fontWeight: 600 }}>
                Your network links
              </Text>
              {userProfile.SocialLinks.map((socialLink, index) => (
                <Group key={index} mb="sm">
                  <TextInput
                    key={index}
                    placeholder="https://..."
                    value={String(socialLink) || ""}
                    onChange={(event) => handleEditSocialLink(index, event.currentTarget.value)}
                    styles={{ input: styles.input }}
                    mt={5}
                    style={{ width: '500px' }}
                  />

                  <Button onClick={() => handleRemoveSocialLink(index)} color="red" size="xs">Remove</Button>
                </Group>
              ))}

              <Button
                onClick={handleAddSocialLink}
                size="xs"
                mt={5}
                style={styles.secondaryButton}
              >
                + Add link
              </Button>
            </Box>

            <Button fullWidth mt="xl" style={styles.primaryButton} onClick={handleSubmit}>
              Edit Profile
            </Button>
          </Paper>
        )}
      </Container>
    </Layout>
  );
}
