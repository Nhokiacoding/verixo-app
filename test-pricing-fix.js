// Quick test to verify pricing display
console.log('Testing pricing display...');

// Test data
const pricingPlans = [
  {
    name: "Starter",
    price: "3200",
    period: "per number",
    description: "Perfect for personal use"
  },
  {
    name: "Professional", 
    price: "3400",
    period: "per number",
    description: "Best for businesses"
  },
  {
    name: "Enterprise",
    price: "3500", 
    period: "per number",
    description: "For premium services"
  }
];

// Test display
pricingPlans.forEach(plan => {
  console.log(`${plan.name}: ₦${plan.price}/${plan.period} - ${plan.description}`);
});

console.log('✅ Pricing display test complete');