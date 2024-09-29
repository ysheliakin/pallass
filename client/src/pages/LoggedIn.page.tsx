import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@mantine/core';

export function LoggedInPage() {
  const navigate = useNavigate();

  return <Title order={1} text-align="center">Welcome! Enjoy the full functionalities of our web application!</Title>;
}

