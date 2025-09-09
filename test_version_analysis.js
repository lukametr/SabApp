const axios = require('axios');

// This script tests the version metrics system with sample data
async function testVersionAnalysis() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing Version Analysis System');
  console.log('===================================');
  
  try {
    // 1. Check if API is running
    console.log('\n1. Checking API health...');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log('✅ API is healthy:', healthResponse.data.status);
    console.log('   MongoDB:', healthResponse.data.mongodb);
    console.log('   Uptime:', healthResponse.data.uptime, 'seconds');
    
    // 2. Record some sample deployment metrics
    console.log('\n2. Recording sample deployment metrics...');
    
    const sampleVersions = [
      { version: 'v1.0.0-alpha', score: 65 },
      { version: 'v1.0.0-beta', score: 78 },
      { version: 'v1.0.0-rc1', score: 82 },
      { version: 'v1.0.0-rc2', score: 89 },
      { version: 'v1.0.0', score: 95 }
    ];
    
    for (const sample of sampleVersions) {
      try {
        const response = await axios.post(`${baseUrl}/api/version-metrics/record`, {
          version: sample.version
        });
        console.log(`✅ Recorded metrics for ${sample.version}`);
      } catch (error) {
        console.log(`⚠️ Failed to record ${sample.version}:`, error.message);
      }
    }
    
    // 3. Get all versions
    console.log('\n3. Retrieving all versions...');
    const versionsResponse = await axios.get(`${baseUrl}/api/version-metrics/versions`);
    console.log(`✅ Found ${versionsResponse.data.length} versions`);
    versionsResponse.data.forEach((v, i) => {
      console.log(`   ${i + 1}. ${v.version} - Score: ${v.score} (${v.deploymentDate})`);
    });
    
    // 4. Get version analysis
    console.log('\n4. Getting version analysis...');
    const analysisResponse = await axios.get(`${baseUrl}/api/version-metrics/analysis`);
    const analysis = analysisResponse.data;
    
    console.log('📊 Version Analysis Results:');
    console.log(`   Total Versions: ${analysis.totalVersions}`);
    console.log(`   Average Score: ${analysis.averageScore}`);
    console.log(`   Recent Trend: ${analysis.recentTrend}`);
    
    if (analysis.bestVersion) {
      console.log(`   🏆 Best Version: ${analysis.bestVersion.version} (Score: ${analysis.bestVersion.score})`);
    }
    
    if (analysis.worstVersion) {
      console.log(`   ⚠️ Worst Version: ${analysis.worstVersion.version} (Score: ${analysis.worstVersion.score})`);
    }
    
    console.log('\n📋 Recommendations:');
    analysis.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
    
    // 5. Get comprehensive best versions report
    console.log('\n5. Getting comprehensive best versions report...');
    const reportResponse = await axios.get(`${baseUrl}/api/version-metrics/best-versions-report`);
    const report = reportResponse.data;
    
    console.log('📈 Best Versions Report:');
    console.log('   Top 5 Versions:');
    report.topVersions.forEach((v, i) => {
      console.log(`   ${i + 1}. ${v.version} - Score: ${v.score} (${new Date(v.deploymentDate).toLocaleDateString()})`);
    });
    
    if (report.performanceComparison) {
      console.log('\n📊 Performance Comparison (Current vs Best):');
      console.log(`   Score Difference: ${report.performanceComparison.scoreDifference.toFixed(2)}`);
      console.log(`   Response Time Difference: ${report.performanceComparison.responseTimeDifference}ms`);
      console.log(`   Memory Usage Difference: ${report.performanceComparison.memoryUsageDifference}MB`);
    }
    
    console.log('\n💡 Improvement Suggestions:');
    report.improvementSuggestions.forEach((suggestion, i) => {
      console.log(`   ${i + 1}. ${suggestion}`);
    });
    
    console.log('\n🎉 Version Analysis System Test Completed Successfully!');
    console.log('\nYou can now view the analysis at:');
    console.log(`   📊 All Versions: ${baseUrl}/api/version-metrics/versions`);
    console.log(`   📈 Analysis: ${baseUrl}/api/version-metrics/analysis`);
    console.log(`   🏆 Best Versions Report: ${baseUrl}/api/version-metrics/best-versions-report`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.status, error.response.data);
    }
  }
}

// Check if server is running, if not provide instructions
async function checkServer() {
  try {
    await axios.get('http://localhost:3001/health');
    await testVersionAnalysis();
  } catch (error) {
    console.log('❌ Server is not running on localhost:3001');
    console.log('\nTo start the server:');
    console.log('1. cd apps/backend');
    console.log('2. pnpm start:dev');
    console.log('3. Run this script again');
  }
}

checkServer();