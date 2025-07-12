async function testSwapRequest() {
  try {
    console.log('🧪 Testing Swap Request Functionality...\n');

    // Test 1: Get all users
    console.log('1. Getting all users...');
    const usersResponse = await fetch('http://localhost:3001/api/users');
    const users = await usersResponse.json();
    console.log(`✅ Found ${users.length} users`);
    
    if (users.length < 2) {
      console.log('❌ Need at least 2 users to test swap requests');
      return;
    }

    const user1 = users[0];
    const user2 = users[1];
    
    console.log(`   User 1: ${user1.name} (${user1.id})`);
    console.log(`   User 2: ${user2.name} (${user2.id})`);

    // Test 2: Create a swap request
    console.log('\n2. Creating swap request...');
    const swapRequest = {
      fromUserId: user1.id,
      toUserId: user2.id,
      skillOffered: user1.skillsOffered[0] || 'Web Development',
      skillWanted: user2.skillsOffered[0] || 'Graphic Design',
      message: 'Hi! I would love to swap skills with you. I can teach you web development and would love to learn graphic design from you.'
    };

    const requestResponse = await fetch('http://localhost:3001/api/swaps/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(swapRequest)
    });

    if (requestResponse.ok) {
      const requestData = await requestResponse.json();
      console.log('✅ Swap request created successfully');
      console.log(`   Request ID: ${requestData.request.id}`);
      console.log(`   Status: ${requestData.request.status}`);
    } else {
      const errorData = await requestResponse.json();
      console.log(`❌ Failed to create swap request: ${errorData.message}`);
    }

    // Test 3: Get incoming requests for user2
    console.log('\n3. Getting incoming requests for user2...');
    const incomingResponse = await fetch(`http://localhost:3001/api/swaps/incoming/${user2.id}`);
    const incomingRequests = await incomingResponse.json();
    console.log(`✅ Found ${incomingRequests.length} incoming requests for ${user2.name}`);

    // Test 4: Get outgoing requests for user1
    console.log('\n4. Getting outgoing requests for user1...');
    const outgoingResponse = await fetch(`http://localhost:3001/api/swaps/outgoing/${user1.id}`);
    const outgoingRequests = await outgoingResponse.json();
    console.log(`✅ Found ${outgoingRequests.length} outgoing requests for ${user1.name}`);

    // Test 5: Accept the request (if there are incoming requests)
    if (incomingRequests.length > 0) {
      console.log('\n5. Accepting the first incoming request...');
      const requestToAccept = incomingRequests[0];
      const acceptResponse = await fetch(`http://localhost:3001/api/swaps/accept/${requestToAccept.id}`, {
        method: 'PUT'
      });

      if (acceptResponse.ok) {
        console.log('✅ Request accepted successfully');
      } else {
        const errorData = await acceptResponse.json();
        console.log(`❌ Failed to accept request: ${errorData.message}`);
      }
    }

    console.log('\n🎉 Swap request functionality test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSwapRequest(); 