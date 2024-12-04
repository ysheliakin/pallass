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
    const options = {
        method: 'POST',
        body: JSON.stringify(groupData)
    }

    const response = await fetch(`${base}/newgroup/${grant}`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };
}

export async function createGroup(groupData: GroupData) {
    const options = {
        method: 'POST',
        body: JSON.stringify(groupData)
    }

    const response = await fetch(`${base}/newgroup`, options);
    const result = await response.json();
    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };
}

export async function addGroupMember(groupMembersData: GroupMembers) {
    console.log("groupMembersData (addGroupMember(): ", groupMembersData)

    const options = {
        method: 'POST',
        body: JSON.stringify(groupMembersData)
    }

    const response = await fetch(`${base}/addgroupmember`, options);
    const result = await response.json();

    console.log("result: ", result)

    if (!response.ok) {
        console.error('Request failed: ', result);
    }
    return { ...result, ok: response.ok };   
}
