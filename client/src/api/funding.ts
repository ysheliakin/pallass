const base = import.meta.env.VITE_API_ENDPOINT;

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
        body: JSON.stringify(body)
    }
    const response = await fetch(`${base}/funding`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    console.log(result);
    return result;
}
