import React, { useEffect, useState } from 'react';
import { Button, Card, Center, Group, Loader, NumberFormatterFactory, Text, Title } from '@mantine/core';
import { getFundingOpportunities } from '@/api/funding';
import { Layout } from '@/components/layout';

/*type FundingItem = {
  Title: string;
  Description: string;
  TargetAmount: number;
  Link: string;
  DeadlineDate: Date;
}; */

type FundingItem = {
  id: number;
  Title: string;
  TargetAmount: number;  // Dollar amount
  major: string;         // Major (e.g., "Computer Science")
  deadlineDate: Date;    // Deadline date
};

const fundingItems: FundingItem[] = [
  { id: 1, Title: 'AI Research Grant', TargetAmount: 10000, major: 'Computer Science', deadlineDate: new Date('2024-12-31') },
  { id: 2, Title: 'Biology Scholarship', TargetAmount: 5000, major: 'Biology', deadlineDate: new Date('2024-11-30') },
  { id: 3, Title: 'Mathematics Fellowship', TargetAmount: 20000, major: 'Mathematics', deadlineDate: new Date('2025-01-15') },
  { id: 4, Title: 'Data Science Fellowship', TargetAmount: 12000, major: 'Computer Science', deadlineDate: new Date('2024-12-15') },
];

// Function to filter funding items by dollar amount, major, and deadline
const filterFundingItems = (
  minAmount: number,
  maxAmount: number,
  major: string,
  deadline: Date
): FundingItem[] => {
  return fundingItems.filter(item => 
    item.TargetAmount >= minAmount && 
    item.TargetAmount <= maxAmount && 
    item.major.toLowerCase().includes(major.toLowerCase()) && 
    item.deadlineDate <= deadline
  );
};

  // Handle form input changes
  const handleMinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setMinAmount(Number(e.target.value));
  const handleMaxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setMaxAmount(Number(e.target.value));
  const handleMajorChange = (e: React.ChangeEvent<HTMLInputElement>) => setMajor(e.target.value);
  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => setDeadline(new Date(e.target.value));


  const FilterableFundingItems = () => {
    // State for input fields
    const [minAmount, setMinAmount] = useState<number>(0);
    const [maxAmount, setMaxAmount] = useState<number>(100000);
    const [major, setMajor] = useState<string>('');
    const [deadline, setDeadline] = useState<Date>(new Date());
  
    const [filteredItems, setFilteredItems] = useState<FundingItem[]>(fundingItems);
  
    // Filter function
    const filterFundingItems = () => {
      const filtered = fundingItems.filter(item =>
        item.TargetAmount >= minAmount &&
        item.TargetAmount <= maxAmount &&
        item.major.toLowerCase().includes(major.toLowerCase()) &&
        item.deadlineDate <= deadline
      );
      setFilteredItems(filtered);
    };
  
    // Handle form input changes
    const handleMinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setMinAmount(Number(e.target.value));
    const handleMaxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setMaxAmount(Number(e.target.value));
    const handleMajorChange = (e: React.ChangeEvent<HTMLInputElement>) => setMajor(e.target.value);
    const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => setDeadline(new Date(e.target.value));
  
    return (
      <div>
        <h1>Funding Opportunities</h1>
  
        {/* Filter form */}
        <div>
          <label>
            Minimum Amount: 
            <input type="number" value={minAmount} onChange={handleMinAmountChange} />
          </label>
  
          <label>
            Maximum Amount: 
            <input type="number" value={maxAmount} onChange={handleMaxAmountChange} />
          </label>
  
          <label>
            Major: 
            <input type="text" value={major} onChange={handleMajorChange} />
          </label>
  
          <label>
            Deadline: 
            <input type="date" value={deadline.toISOString().split('T')[0]} onChange={handleDeadlineChange} />
          </label>
  
          <button onClick={filterFundingItems}>Filter</button>
        </div>
  
        {/* Display filtered items */}
        <div>
          {filteredItems.length === 0 ? (
            <p>No funding opportunities found with the given criteria.</p>
          ) : (
            <ul>
              {filteredItems.map(item => (
                <li key={item.id}>
                  <h2>{item.Title}</h2>
                  <p><strong>Amount:</strong> ${item.TargetAmount}</p>
                  <p><strong>Major:</strong> {item.major}</p>
                  <p><strong>Deadline:</strong> {item.deadlineDate.toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };
  
  export default FilterableFundingItems;
