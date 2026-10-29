import { connectDB, closeDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Lead } from '../models/Lead.js';
import { Customer } from '../models/Customer.js';
import { Call } from '../models/Call.js';
import { Deal } from '../models/Deal.js';
import { Followup } from '../models/Followup.js';
import { Objection } from '../models/Objection.js';
import { Knowledge } from '../models/Knowledge.js';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const seedUsers = [
  { name: 'Alex Rivera', email: 'alex@truckpilot.ai', password: 'demo1234', role: 'admin', phone: '+1 (555) 901-2345', status: 'active', callsToday: 12, activeLeads: 28, deals: 5, revenue: '$124,500', conversionRate: '31.4%' },
  { name: 'Sarah Chen', email: 'sarah@truckpilot.ai', password: 'demo1234', role: 'salesman', phone: '+1 (555) 902-3456', status: 'in-call', callsToday: 9, activeLeads: 22, deals: 3, revenue: '$78,200', conversionRate: '28.6%' },
  { name: 'Marcus Johnson', email: 'marcus@truckpilot.ai', password: 'demo1234', role: 'salesman', phone: '+1 (555) 903-4567', status: 'active', callsToday: 7, activeLeads: 19, deals: 4, revenue: '$95,100', conversionRate: '25.9%' },
  { name: 'Emily Rodriguez', email: 'emily@truckpilot.ai', password: 'demo1234', role: 'salesman', phone: '+1 (555) 904-5678', status: 'away', callsToday: 5, activeLeads: 15, deals: 2, revenue: '$52,700', conversionRate: '22.1%' },
];

const seedLeads = [
  { name: 'Marcus Vance', company: 'Vance Freight Solutions', title: 'Fleet Director', fleetSize: 48, truckType: 'Dry Van', location: 'Dallas, TX', status: 'Qualified', leadScore: 94, temperature: 'HOT', phone: '+1 (214) 555-7801', email: 'marcus@vancefreight.com', currentProvider: 'Motive', annualEstimate: '$87,200', service: 'ELD & Fuel Card Program', objections: ['Contract lock-in concern'], tags: ['Dry Van', 'High-Fleet'] },
  { name: 'Sarah Kowalski', company: 'Trans-America Haulers', title: 'Operations Manager', fleetSize: 32, truckType: 'Reefer', location: 'Chicago, IL', status: 'Interested', leadScore: 88, temperature: 'HOT', phone: '+1 (312) 555-4521', email: 'sarah@transamerica.com', currentProvider: 'Samsara', annualEstimate: '$64,000', service: 'ELD Compliance & GPS Tracking', objections: [], tags: ['Reefer', 'Mid-Fleet'] },
  { name: 'Tom Callahan', company: 'Callahan Brothers Trucking', title: 'Owner-Operator', fleetSize: 8, truckType: 'Flatbed', location: 'Phoenix, AZ', status: 'Contacted', leadScore: 72, temperature: 'WARM', phone: '+1 (602) 555-9012', email: 'tom@callahanbrothers.com', currentProvider: 'J.J. Keller', annualEstimate: '$18,500', service: 'ELD Compliance', objections: ['Price too high'], tags: ['Flatbed', 'Small-Fleet'] },
  { name: 'Diana Foster', company: 'FastLane Logistics', title: 'VP of Operations', fleetSize: 120, truckType: 'Mixed', location: 'Atlanta, GA', status: 'Negotiation', leadScore: 91, temperature: 'HOT', phone: '+1 (404) 555-3344', email: 'diana@fastlanelogistics.com', currentProvider: 'Omnitracs', annualEstimate: '$215,000', service: 'Full Fleet Management Suite', objections: ['Switching cost concerns', 'Integration complexity'], tags: ['Enterprise', 'Mixed-Fleet'] },
  { name: 'Roberto Sanchez', company: 'Southwest Express Freight', title: 'Fleet Manager', fleetSize: 56, truckType: 'Dry Van', location: 'Houston, TX', status: 'Follow-up', leadScore: 79, temperature: 'WARM', phone: '+1 (713) 555-8821', email: 'roberto@swexpress.com', currentProvider: 'PeopleNet', annualEstimate: '$98,000', service: 'ELD & Fuel Card Program', objections: ['Needs board approval'], tags: ['Dry Van', 'Large-Fleet'] },
  { name: 'Amy Zhang', company: 'Pacific Rim Carriers', title: 'Director of Compliance', fleetSize: 75, truckType: 'Intermodal', location: 'Los Angeles, CA', status: 'New', leadScore: 65, temperature: 'COLD', phone: '+1 (310) 555-6677', email: 'amy@pacificrimcarriers.com', currentProvider: 'Trimble', annualEstimate: '$132,000', service: 'Compliance & Driver Safety', objections: [], tags: ['Intermodal', 'Compliance-Focused'] },
  { name: 'James Wright', company: 'Wright Brothers Transport', title: 'CEO', fleetSize: 22, truckType: 'Tanker', location: 'Nashville, TN', status: 'Interested', leadScore: 83, temperature: 'HOT', phone: '+1 (615) 555-2233', email: 'james@wrightbrotherstransport.com', currentProvider: 'FleetUp', annualEstimate: '$42,000', service: 'Fuel Card & ELD Bundle', objections: ['Wants demo first'], tags: ['Tanker', 'Mid-Fleet'] },
  { name: 'Linda Nguyen', company: 'Gulf Coast Shipping Co', title: 'Operations Director', fleetSize: 38, truckType: 'Dry Van', location: 'New Orleans, LA', status: 'Won', leadScore: 97, temperature: 'HOT', phone: '+1 (504) 555-9988', email: 'linda@gulfcoastshipping.com', currentProvider: 'Samsara', annualEstimate: '$72,500', service: 'Full Platform Migration', objections: [], tags: ['Won', 'Priority-Client'] },
];

const seedCustomers = [
  { companyName: 'Gulf Coast Shipping Co', contactPerson: 'Linda Nguyen', role: 'Operations Director', phone: '+1 (504) 555-9988', email: 'linda@gulfcoastshipping.com', location: 'New Orleans, LA', fleetSize: 38, truckTypes: 'Dry Van', currentProvider: 'TruckPilot AI', interestedServices: ['ELD Compliance', 'Fuel Card Program', 'GPS Tracking'], relationshipStatus: 'Active Account', accountValue: '$72,500/yr', healthScore: 94, temperature: 'HOT', leadScore: 97, joinedDate: 'Mar 2026', tags: ['Priority', 'High-Value'] },
  { companyName: 'Midwest Freight Alliance', contactPerson: 'Robert Kramer', role: 'Fleet Manager', phone: '+1 (312) 555-7732', email: 'robert@midwestfreight.com', location: 'Indianapolis, IN', fleetSize: 65, truckTypes: 'Reefer & Dry Van', currentProvider: 'TruckPilot AI', interestedServices: ['ELD Compliance', 'Predictive Maintenance'], relationshipStatus: 'Renewal Due', accountValue: '$118,000/yr', healthScore: 78, temperature: 'WARM', leadScore: 82, joinedDate: 'Jan 2026', tags: ['Renewal', 'Mid-Priority'] },
  { companyName: 'Rocky Mountain Logistics', contactPerson: 'Carol Brennan', role: 'VP Operations', phone: '+1 (303) 555-4421', email: 'carol@rockymtnlogistics.com', location: 'Denver, CO', fleetSize: 29, truckTypes: 'Flatbed', currentProvider: 'TruckPilot AI', interestedServices: ['Driver Safety', 'ELD Compliance'], relationshipStatus: 'Active Account', accountValue: '$54,300/yr', healthScore: 88, temperature: 'HOT', leadScore: 90, joinedDate: 'Feb 2026', tags: ['Active', 'Satisfied'] },
];

const seedCalls = [
  { customer: 'Marcus Vance', company: 'Vance Freight Solutions', agentType: 'ai', agent: 'TruckPilot AI v2.4', direction: 'outbound', status: 'Completed', duration: '4m 22s', durationSec: 262, outcome: 'Qualified & Demo Scheduled', intent: 'Contract Switch Inquiry', leadScore: 94, leadTemp: 'HOT', sentiment: 'Very Positive (91%)', summary: 'Marcus expressed strong interest in switching from Motive. Agreed to a full demo next Wednesday. Fleet of 48 dry van trucks. Budget confirmed at ~$87K annually.', nextAction: 'Send demo invite & pricing comparison', objectionsDetected: ['Contract lock-in concern'], handoffTriggered: false },
  { customer: 'Sarah Kowalski', company: 'Trans-America Haulers', agentType: 'ai', agent: 'TruckPilot AI v2.4', direction: 'outbound', status: 'Handoff', duration: '7m 15s', durationSec: 435, outcome: 'Human Handoff - Complex Negotiation', intent: 'Pricing & Contract Terms', leadScore: 88, leadTemp: 'HOT', sentiment: 'Positive (76%)', summary: 'Sarah asked detailed questions about contract terms and multi-year discounts. Escalated to senior rep for custom pricing.', nextAction: 'Senior rep follow-up within 24 hrs', objectionsDetected: ['Multi-year commitment hesitancy'], handoffTriggered: true, handoffReason: 'Pricing negotiation complexity', transferredTo: 'Alex Rivera' },
  { customer: 'Tom Callahan', company: 'Callahan Brothers Trucking', agentType: 'ai', agent: 'TruckPilot AI v2.4', direction: 'outbound', status: 'Completed', duration: '2m 48s', durationSec: 168, outcome: 'Follow-up Needed - Price Objection', intent: 'Initial Qualification', leadScore: 72, leadTemp: 'WARM', sentiment: 'Neutral (58%)', summary: 'Tom was skeptical about pricing. Small fleet of 8 trucks. Objected to monthly cost. Agreed to review email with detailed breakdown.', nextAction: 'Send pricing breakdown email', objectionsDetected: ['Price too high', 'Small fleet discount'], handoffTriggered: false },
  { customer: 'Diana Foster', company: 'FastLane Logistics', agentType: 'human', agent: 'Alex Rivera', direction: 'inbound', status: 'Completed', duration: '12m 30s', durationSec: 750, outcome: 'Proposal Sent - Enterprise Deal', intent: 'Enterprise Contract Review', leadScore: 91, leadTemp: 'HOT', sentiment: 'Positive (82%)', summary: 'Diana called in to discuss enterprise package. 120-truck fleet. ROI analysis shared. Proposal for $215K deal submitted.', nextAction: 'Contract review meeting Friday', objectionsDetected: ['Switching cost concerns'], handoffTriggered: false },
  { customer: 'Roberto Sanchez', company: 'Southwest Express Freight', agentType: 'ai', agent: 'TruckPilot AI v2.4', direction: 'outbound', status: 'No Answer', duration: '0m 45s', durationSec: 45, outcome: 'Voicemail Left', intent: 'Follow-up Call', leadScore: 79, leadTemp: 'WARM', sentiment: 'N/A', summary: 'No answer. Voicemail left with callback number and offer details.', nextAction: 'Retry call tomorrow 10am', objectionsDetected: [], handoffTriggered: false },
];

const seedDeals = [
  { title: 'Vance Freight - ELD Package', company: 'Vance Freight Solutions', contact: 'Marcus Vance', value: 87200, stage: 'Negotiation', probability: 80, priority: 'high', services: ['ELD Compliance', 'Fuel Card'], fleetSize: 48, lastActivity: 'Demo completed, pricing discussion', tags: ['ELD', 'High-Value'] },
  { title: 'FastLane Logistics - Enterprise Suite', company: 'FastLane Logistics', contact: 'Diana Foster', value: 215000, stage: 'Proposal', probability: 65, priority: 'high', services: ['Full Fleet Management', 'AI Dispatch', 'Driver Safety'], fleetSize: 120, lastActivity: 'Proposal submitted, awaiting board review', tags: ['Enterprise', 'Q4-Target'] },
  { title: 'Trans-America Haulers - Reefer Package', company: 'Trans-America Haulers', contact: 'Sarah Kowalski', value: 64000, stage: 'Qualified', probability: 55, priority: 'medium', services: ['ELD Compliance', 'GPS Tracking'], fleetSize: 32, lastActivity: 'Pricing call completed', tags: ['Reefer', 'Mid-Market'] },
  { title: 'Wright Brothers - Fuel Bundle', company: 'Wright Brothers Transport', contact: 'James Wright', value: 42000, stage: 'Discovery', probability: 30, priority: 'medium', services: ['Fuel Card', 'ELD Bundle'], fleetSize: 22, lastActivity: 'Initial qualification call', tags: ['Tanker', 'New-Prospect'] },
  { title: 'Gulf Coast - Full Migration', company: 'Gulf Coast Shipping Co', contact: 'Linda Nguyen', value: 72500, stage: 'Won', probability: 100, priority: 'high', services: ['Full Platform Migration', 'Training', 'Support'], fleetSize: 38, lastActivity: 'Contract signed - Onboarding in progress', tags: ['Won', 'Closed'] },
  { title: 'Callahan Brothers - Basic ELD', company: 'Callahan Brothers Trucking', contact: 'Tom Callahan', value: 18500, stage: 'Discovery', probability: 25, priority: 'low', services: ['ELD Compliance'], fleetSize: 8, lastActivity: 'Price objection - follow-up email sent', tags: ['Small-Fleet', 'Price-Sensitive'] },
];

const seedFollowups = [
  { contactName: 'Marcus Vance', company: 'Vance Freight Solutions', type: 'demo', status: 'scheduled', priority: 'high', scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), notes: 'Full platform demo. Prepare ELD + fuel card ROI breakdown.', assignedRepName: 'Alex Rivera', tags: ['Hot-Lead', 'Demo'] },
  { contactName: 'Sarah Kowalski', company: 'Trans-America Haulers', type: 'call', status: 'scheduled', priority: 'high', scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), notes: 'Custom pricing follow-up. Check with finance on multi-year discount.', assignedRepName: 'Alex Rivera', tags: ['Negotiation', 'Urgent'] },
  { contactName: 'Tom Callahan', company: 'Callahan Brothers Trucking', type: 'email', status: 'scheduled', priority: 'medium', scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), notes: 'Send detailed pricing breakdown for small fleet.', assignedRepName: 'Sarah Chen', tags: ['Price-Objection'] },
  { contactName: 'Roberto Sanchez', company: 'Southwest Express Freight', type: 'call', status: 'overdue', priority: 'medium', scheduledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), notes: 'Retry call - no answer yesterday.', assignedRepName: 'Marcus Johnson', tags: ['Retry', 'Voicemail'] },
  { contactName: 'Diana Foster', company: 'FastLane Logistics', type: 'meeting', status: 'scheduled', priority: 'urgent', scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), notes: 'Contract review meeting with board. Bring legal team.', assignedRepName: 'Alex Rivera', tags: ['Enterprise', 'Contract-Review'] },
];

const seedObjections = [
  { objection: 'Your price is too high compared to Samsara', category: 'price', frequency: 47, approvedResponse: 'Our ELD + fuel savings typically offset 60-80% of the monthly cost within the first 90 days. Let me show you a personalized ROI breakdown based on your fleet size...', effectiveness: 84, status: 'active', tags: ['Price', 'Competitor'] },
  { objection: 'We are locked into a contract with our current provider', category: 'contract', frequency: 38, approvedResponse: 'We offer a buyout guarantee — we will cover your early termination fees up to $5,000 per truck. Many of our clients came from similar situations and saved thousands in the first year.', effectiveness: 78, status: 'active', tags: ['Contract', 'Buyout'] },
  { objection: 'Now is not a good time — too busy with operations', category: 'timing', frequency: 29, approvedResponse: 'Completely understand — that is exactly why our implementation team handles the full migration with zero operational downtime, typically in under 72 hours. When IS the best time?', effectiveness: 71, status: 'active', tags: ['Timing', 'Implementation'] },
  { objection: 'Motive has been with us for years and we know it well', category: 'competitor', frequency: 24, approvedResponse: 'Loyalty to familiar tools makes sense. Our switching concierge program includes full data migration and a 30-day parallel operation so your team never loses a beat.', effectiveness: 69, status: 'active', tags: ['Competitor', 'Loyalty'] },
  { objection: 'We need to get approval from the board first', category: 'other', frequency: 21, approvedResponse: 'Absolutely — would it help if I prepared a one-page executive summary with projected annual savings for your board presentation? We have done this for 40+ fleets this quarter.', effectiveness: 76, status: 'active', tags: ['Internal', 'Decision-Maker'] },
];

const seedKnowledge = [
  { title: 'ELD Mandate Compliance Guide 2026', category: 'compliance', content: 'The FMCSA ELD mandate requires all CMV drivers to use certified ELD devices. TruckPilot ELD is FMCSA-certified and supports all major telematics integrations...', summary: 'Complete guide to FMCSA ELD compliance requirements and TruckPilot ELD certification', status: 'active', usageCount: 234, tags: ['ELD', 'Compliance', 'FMCSA'] },
  { title: 'Outbound AI Call Opening Script - Trucking', category: 'script', content: 'Hi [Contact Name], this is TruckPilot AI calling from [Company]. I am reaching out because your fleet profile matches companies saving between $800 to $2,400 per truck annually on fuel and compliance costs...', summary: 'Primary outbound call script for cold/warm lead outreach', status: 'active', usageCount: 892, tags: ['Script', 'Outbound', 'Opening'] },
  { title: 'Competitor Comparison: TruckPilot vs Samsara', category: 'competitor', content: 'Feature-by-feature comparison of TruckPilot AI vs Samsara Fleet Management. Key differentiators: AI Voice Agent (TruckPilot only), predictive fuel optimization, and automatic contract buyout program...', summary: 'Detailed comparison sheet for Samsara competitive situations', status: 'active', usageCount: 156, tags: ['Competitor', 'Samsara', 'Comparison'] },
  { title: 'Fuel Card Program ROI Calculator', category: 'pricing', content: 'Average fuel savings per truck: $180/month. With 24-truck fleet: $4,320/month = $51,840/year. TruckPilot Fuel Card annual cost for 24 trucks: $14,400. Net savings: $37,440/year...', summary: 'ROI calculation methodology for fuel card upsell conversations', status: 'active', usageCount: 445, tags: ['Fuel-Card', 'ROI', 'Pricing'] },
  { title: 'Contract Buyout Guarantee Policy', category: 'product', content: 'TruckPilot offers up to $5,000 per truck in ETF (Early Termination Fee) coverage for new enterprise accounts. Eligibility: minimum 20 trucks, contract duration minimum 24 months...', summary: 'Policy details for the contract buyout guarantee program', status: 'active', usageCount: 167, tags: ['Contract', 'Buyout', 'Policy'] },
];

async function seed() {
  console.log('🌱 Starting database seed...');
  await connectDB();

  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Lead.deleteMany({}),
    Customer.deleteMany({}),
    Call.deleteMany({}),
    Deal.deleteMany({}),
    Followup.deleteMany({}),
    Objection.deleteMany({}),
    Knowledge.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Seed users
  const users = await User.insertMany(seedUsers);
  console.log(`✅ Seeded ${users.length} users`);

  // Assign IDs to leads and other entities
  const adminUser = users[0];
  const leadsWithUser = seedLeads.map((l) => ({ ...l, assignedTo: adminUser._id, assignedRepName: adminUser.name }));
  const leads = await Lead.insertMany(leadsWithUser);
  console.log(`✅ Seeded ${leads.length} leads`);

  const customersWithUser = seedCustomers.map((c) => ({ ...c, assignedTo: adminUser._id, assignedRepName: adminUser.name }));
  const customers = await Customer.insertMany(customersWithUser);
  console.log(`✅ Seeded ${customers.length} customers`);

  const calls = await Call.insertMany(seedCalls);
  console.log(`✅ Seeded ${calls.length} calls`);

  const dealsWithUser = seedDeals.map((d) => ({ ...d, assignedTo: adminUser._id, assignedRepName: adminUser.name }));
  const deals = await Deal.insertMany(dealsWithUser);
  console.log(`✅ Seeded ${deals.length} deals`);

  const followupsWithUser = seedFollowups.map((f) => ({ ...f, assignedTo: adminUser._id }));
  const followups = await Followup.insertMany(followupsWithUser);
  console.log(`✅ Seeded ${followups.length} follow-ups`);

  const objections = await Objection.insertMany(seedObjections.map((o) => ({ ...o, createdBy: adminUser._id })));
  console.log(`✅ Seeded ${objections.length} objections`);

  const knowledge = await Knowledge.insertMany(seedKnowledge.map((k) => ({ ...k, createdBy: adminUser._id })));
  console.log(`✅ Seeded ${knowledge.length} knowledge items`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin:  alex@truckpilot.ai    / demo1234');
  console.log('   Rep:    sarah@truckpilot.ai   / demo1234');
  console.log('   Rep:    marcus@truckpilot.ai  / demo1234');

  await closeDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
