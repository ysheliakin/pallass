import { base } from './base';

type GroupData = {
    name: string;
    privacy: boolean;
    description: string;
};

type GroupMembers = {
    GroupID: string;
    UserEmail: string | null;
    Role: string;
};

export async function createGroupWithGrant(groupData: GroupData, grant: string) {
    const token = localStorage.getItem('token');

    const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupData)
    }

    const response = await fetch(`http://${base}/newgroup/${grant}`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };
}

export async function createGroup(groupData: GroupData) {
    const token = localStorage.getItem('token');

    const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupData)
    }

    const response = await fetch(`http://${base}/newgroup`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };
}

export async function addGroupMember(groupMembersData: GroupMembers) {
    console.log("groupMembersData (addGroupMember(): ", groupMembersData)

    const token = localStorage.getItem('token');

    const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupMembersData)
    }

    const response = await fetch(`http://${base}/addgroupmember`, options);
    const result = await response.json();

    console.log("result: ", result)

    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };   
}
