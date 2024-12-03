import { base } from './base';
const token = localStorage.getItem('token')

export async function createFundingOpportunity(title: string, description: string, amount: number, link: string, deadline: Date | null) {
    const body ={
        title,
        description,
        target_amount: amount,
        link,
        deadline_date: deadline?.toISOString(),
    };
    console.log(body)
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
    const response = await fetch(`http://${base}/funding`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    console.log(result);
    return result;
}
 
export async function getFundingOpportunities() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    const response = await fetch(`http://${base}/funding`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    console.log(result);
    return result;
}
