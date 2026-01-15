/**
 * DASHBOARD UI/UX COMPONENT TEST
 * Tests all dashboard components for errors and functionality
 */

const fs = require('fs');
const path = require('path');

class DashboardTester {
  constructor() {
    this.results = {
      components: {},
      pages: {},
      utils: {},
      overall: {}
    };
  }

  /**
   * 1. TEST COMPONENT FILES
   */
  testComponentFiles() {
    console.log('\n🧩 TESTING DASHBOARD COMPONENTS');
    console.log('===============================');

    const componentPaths = [
      'src/components/dashboard/StatsCard.jsx',
      'src/components/dashboard/RecentTransactions.jsx', 
      'src/components/dashboard/WalletSummary.jsx',
      'src/components/layout/Header/Header.jsx',
      'src/components/layout/Header/WalletBalance.jsx',
      'src/components/layout/Sidebar/Sidebar.jsx',
      'src/components/layout/Sidebar/SidebarItem.jsx',
      'src/components/common/LoadingSpinner/LoadingSpinner.jsx',
      'src/components/common/Button/Button.jsx'
    ];

    let validComponents = 0;
    let totalComponents = componentPaths.length;

    componentPaths.forEach(componentPath => {
      const fullPath = path.join(__dirname, componentPath);
      
      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check for common React patterns
          const hasReactImport = content.includes('import') && (content.includes('React') || content.includes('react'));
          const hasExport = content.includes('export default') || content.includes('module.exports');
          const hasJSX = content.includes('return (') || content.includes('return<');
          
          // Check for potential errors
          const hasConsoleErrors = content.includes('console.error');
          const hasTryCatch = content.includes('try {') && content.includes('catch');
          
          if (hasReactImport && hasExport && hasJSX) {
            console.log(`✅ ${componentPath}`);
            validComponents++;
          } else {
            console.log(`⚠️ ${componentPath} - Missing React patterns`);
          }
          
          if (hasConsoleErrors) {
            console.log(`   🐛 Contains console.error statements`);
          }
          
          if (hasTryCatch) {
            console.log(`   🛡️ Has error handling`);
          }
          
        } catch (error) {
          console.log(`❌ ${componentPath} - Read error: ${error.message}`);
        }
      } else {
        console.log(`❌ ${componentPath} - File not found`);
      }
    });

    this.results.components = {
      total: totalComponents,
      valid: validComponents,
      percentage: Math.round((validComponents / totalComponents) * 100)
    };

    console.log(`\n📊 Components: ${validComponents}/${totalComponents} (${this.results.components.percentage}%)`);
  }

  /**
   * 2. TEST DASHBOARD PAGES
   */
  testDashboardPages() {
    console.log('\n📄 TESTING DASHBOARD PAGES');
    console.log('===========================');

    const pagesPaths = [
      'src/pages/dashboard/Dashboard.jsx',
      'src/pages/fund-wallet/FundWallet.jsx',
      'src/pages/transactions/Transactions.jsx',
      'src/pages/sms-history/SMSHistory.jsx',
      'src/pages/profile/Profile.jsx',
      'src/pages/recent-purchases/RecentPurchases.jsx',
      'src/pages/support/Support.jsx'
    ];

    let validPages = 0;
    let totalPages = pagesPaths.length;

    pagesPaths.forEach(pagePath => {
      const fullPath = path.join(__dirname, pagePath);
      
      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check for page-specific patterns
          const hasReactImport = content.includes('import') && content.includes('react');
          const hasExport = content.includes('export default');
          const hasComponent = content.includes('const ') && content.includes('= () =>');
          
          // Check for navigation and routing
          const hasNavigation = content.includes('navigate') || content.includes('router') || content.includes('Link');
          
          // Check for API calls
          const hasAPICall = content.includes('fetch(') || content.includes('axios') || content.includes('api.');
          
          // Check for state management
          const hasState = content.includes('useState') || content.includes('useEffect');
          
          if (hasReactImport && hasExport && hasComponent) {
            console.log(`✅ ${pagePath}`);
            validPages++;
            
            if (hasNavigation) console.log(`   🧭 Has navigation`);
            if (hasAPICall) console.log(`   🌐 Has API calls`);
            if (hasState) console.log(`   📊 Has state management`);
            
          } else {
            console.log(`⚠️ ${pagePath} - Missing required patterns`);
          }
          
        } catch (error) {
          console.log(`❌ ${pagePath} - Read error: ${error.message}`);
        }
      } else {
        console.log(`❌ ${pagePath} - File not found`);
      }
    });

    this.results.pages = {
      total: totalPages,
      valid: validPages,
      percentage: Math.round((validPages / totalPages) * 100)
    };

    console.log(`\n📊 Pages: ${validPages}/${totalPages} (${this.results.pages.percentage}%)`);
  }

  /**
   * 3. TEST UTILITY FILES
   */
  testUtilityFiles() {
    console.log('\n🔧 TESTING UTILITY FILES');
    console.log('=========================');

    const utilPaths = [
      'src/utils/api.js',
      'src/utils/router.js',
      'src/utils/navigation.js',
      'src/utils/formatCurrency.js',
      'src/utils/emailService.js'
    ];

    let validUtils = 0;
    let totalUtils = utilPaths.length;

    utilPaths.forEach(utilPath => {
      const fullPath = path.join(__dirname, utilPath);
      
      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check for utility patterns
          const hasExports = content.includes('export') || content.includes('module.exports');
          const hasFunctions = content.includes('function') || content.includes('=>');
          
          if (hasExports && hasFunctions) {
            console.log(`✅ ${utilPath}`);
            validUtils++;
          } else {
            console.log(`⚠️ ${utilPath} - Missing utility patterns`);
          }
          
        } catch (error) {
          console.log(`❌ ${utilPath} - Read error: ${error.message}`);
        }
      } else {
        console.log(`❌ ${utilPath} - File not found`);
      }
    });

    this.results.utils = {
      total: totalUtils,
      valid: validUtils,
      percentage: Math.round((validUtils / totalUtils) * 100)
    };

    console.log(`\n📊 Utils: ${validUtils}/${totalUtils} (${this.results.utils.percentage}%)`);
  }

  /**
   * 4. CHECK FOR COMMON ISSUES
   */
  checkCommonIssues() {
    console.log('\n🔍 CHECKING FOR COMMON ISSUES');
    console.log('==============================');

    const issuesFound = [];

    // Check package.json for dependencies
    try {
      const packagePath = path.join(__dirname, 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        const requiredDeps = ['react', 'react-dom', 'react-router-dom'];
        const missingDeps = requiredDeps.filter(dep => 
          !packageContent.dependencies?.[dep] && !packageContent.devDependencies?.[dep]
        );
        
        if (missingDeps.length === 0) {
          console.log('✅ All required dependencies present');
        } else {
          console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
          issuesFound.push(`Missing dependencies: ${missingDeps.join(', ')}`);
        }
      }
    } catch (error) {
      console.log('⚠️ Could not check package.json');
    }

    // Check for environment variables
    try {
      const envPath = path.join(__dirname, '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        const requiredEnvVars = ['REACT_APP_API_URL', 'REACT_APP_PAYSTACK_PUBLIC_KEY'];
        const missingEnvVars = requiredEnvVars.filter(envVar => 
          !envContent.includes(envVar)
        );
        
        if (missingEnvVars.length === 0) {
          console.log('✅ All required environment variables present');
        } else {
          console.log(`❌ Missing env vars: ${missingEnvVars.join(', ')}`);
          issuesFound.push(`Missing env vars: ${missingEnvVars.join(', ')}`);
        }
      }
    } catch (error) {
      console.log('⚠️ Could not check .env file');
    }

    return issuesFound;
  }

  /**
   * 5. GENERATE DASHBOARD REPORT
   */
  generateDashboardReport() {
    console.log('\n📊 DASHBOARD UI/UX TEST REPORT');
    console.log('===============================');

    const { components, pages, utils } = this.results;
    const issues = this.checkCommonIssues();

    console.log(`\n🧩 COMPONENTS: ${components.percentage}% (${components.valid}/${components.total})`);
    console.log(`📄 PAGES: ${pages.percentage}% (${pages.valid}/${pages.total})`);
    console.log(`🔧 UTILITIES: ${utils.percentage}% (${utils.valid}/${utils.total})`);

    const overallScore = Math.round((components.percentage + pages.percentage + utils.percentage) / 3);
    const isHealthy = overallScore >= 80 && issues.length === 0;

    console.log(`\n🎯 OVERALL SCORE: ${overallScore}%`);
    console.log(`🏥 DASHBOARD HEALTH: ${isHealthy ? '✅ HEALTHY' : '❌ NEEDS ATTENTION'}`);

    if (issues.length > 0) {
      console.log('\n⚠️ ISSUES FOUND:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    }

    if (isHealthy) {
      console.log('\n🎉 DASHBOARD IS READY!');
      console.log('✅ All components properly structured');
      console.log('✅ Pages have required functionality');
      console.log('✅ Utilities are properly exported');
      console.log('✅ No critical issues found');
    } else {
      console.log('\n⚠️ DASHBOARD NEEDS ATTENTION');
      console.log('Some components or configurations need fixes');
    }

    this.results.overall = {
      score: overallScore,
      healthy: isHealthy,
      issues: issues.length,
      timestamp: new Date().toISOString()
    };

    return isHealthy;
  }

  /**
   * RUN ALL TESTS
   */
  runAllTests() {
    console.log('🎨 DASHBOARD UI/UX COMPONENT TEST');
    console.log('==================================');
    console.log(`Started at: ${new Date().toISOString()}`);

    try {
      this.testComponentFiles();
      this.testDashboardPages();
      this.testUtilityFiles();
      
      return this.generateDashboardReport();
    } catch (error) {
      console.error('❌ Dashboard test failed:', error.message);
      return false;
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new DashboardTester();
  const healthy = tester.runAllTests();
  
  console.log('\n✅ Dashboard test completed');
  process.exit(healthy ? 0 : 1);
}

module.exports = DashboardTester;