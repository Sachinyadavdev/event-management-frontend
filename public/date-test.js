// Simple test to check date handling
// Open browser console and run: testDateHandling('2024-10-23')

async function testDateHandling(dateString) {
  try {
    console.log('🧪 Testing date handling with:', dateString);
    
    const response = await fetch('/api/events/test-date', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test_date: dateString })
    });
    
    const result = await response.json();
    console.log('🧪 Test result:', result);
    
    return result;
  } catch (error) {
    console.error('🧪 Test failed:', error);
  }
}

// Export for browser console use
window.testDateHandling = testDateHandling;