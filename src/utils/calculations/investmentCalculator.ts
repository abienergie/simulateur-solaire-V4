import { FinancialParameters } from '../../types/financial';
import { getPriceFromPower, calculateEnphaseCost } from './priceCalculator';

export interface InvestmentBreakdown {
  baseInstallation: number;
  enphaseUpgrade: number;
  physicalBattery: number;
  smartCharger: number;
  mountingSystem: number;
  ecojoko: number;
  smartBatterySetup: number;
  myBatterySetup: number;
  subtotal: number;
  subsidies: number;
  commercialDiscount: number;
  promoDiscount: number;
  totalInvestment: number;
}

export function calculateTotalInvestment(
  parameters: FinancialParameters,
  installedPower: number,
  inverterType: 'central' | 'solenso' | 'enphase' = 'central',
  mountingSystem: 'surimposition' | 'bac-lestes' | 'integration' = 'surimposition',
  includeEcojoko: boolean = false
): InvestmentBreakdown {
  
  // Base installation price
  const baseInstallation = getPriceFromPower(installedPower);
  
  // Enphase upgrade cost
  const enphaseUpgrade = inverterType === 'enphase' ? calculateEnphaseCost(installedPower) : 0;
  
  // Physical battery cost (only for cash mode)
  const physicalBattery = parameters.financingMode === 'cash' && 
                         parameters.batterySelection?.type === 'physical' && 
                         parameters.batterySelection.model?.oneTimePrice 
                         ? parameters.batterySelection.model.oneTimePrice 
                         : 0;
  
  // Smart charger cost
  const smartCharger = parameters.batterySelection?.includeSmartCharger ? 1500 : 0;
  
  // Mounting system cost (not available in subscription mode)
  const numberOfPanels = Math.ceil(installedPower * 2);
  let mountingSystemCost = 0;
  if (parameters.financingMode === 'cash') {
    if (mountingSystem === 'bac-lestes') {
      mountingSystemCost = 60 * numberOfPanels;
    } else if (mountingSystem === 'integration') {
      mountingSystemCost = 100 * numberOfPanels;
    }
  }
  
  // Ecojoko cost
  const freeEcojoko = localStorage.getItem('freeEcojoko') === 'true';
  const ecojokoPrice = includeEcojoko && !freeEcojoko ? 229 : 0;
  
  // Setup fees for virtual storage solutions
  const freeBatterySetup = localStorage.getItem('promo_free_battery_setup') === 'true';
  const freeSmartBatterySetup = localStorage.getItem('promo_free_smart_battery_setup') === 'true';
  
  const myBatterySetup = parameters.batterySelection?.type === 'mybattery' && !freeBatterySetup ? 179 : 0;
  const smartBatterySetup = parameters.batterySelection?.type === 'virtual' && !freeSmartBatterySetup ? 2000 : 0;
  
  // Calculate subtotal
  const subtotal = baseInstallation + enphaseUpgrade + physicalBattery + smartCharger + 
                  mountingSystemCost + ecojokoPrice + myBatterySetup + smartBatterySetup;
  
  // Deductions
  const subsidies = parameters.connectionType === 'surplus' ? parameters.primeAutoconsommation : 0;
  const commercialDiscount = parameters.remiseCommerciale || 0;
  const promoDiscount = parseFloat(localStorage.getItem('promo_discount') || '0');
  
  // Total investment
  const totalInvestment = subtotal - subsidies - commercialDiscount - promoDiscount;
  
  return {
    baseInstallation,
    enphaseUpgrade,
    physicalBattery,
    smartCharger,
    mountingSystem: mountingSystemCost,
    ecojoko: ecojokoPrice,
    smartBatterySetup,
    myBatterySetup,
    subtotal,
    subsidies,
    commercialDiscount,
    promoDiscount,
    totalInvestment: Math.max(0, totalInvestment)
  };
}

export function getMonthlySubscriptionCost(
  parameters: FinancialParameters,
  installedPower: number
): number {
  if (parameters.financingMode !== 'subscription') return 0;
  
  // Base subscription price
  const baseSubscription = parameters.dureeAbonnement ? 
    getPriceFromPower(installedPower) / (parameters.dureeAbonnement * 12) : 0;
  
  // Add battery monthly costs
  let batteryMonthlyCost = 0;
  
  if (parameters.batterySelection?.type === 'physical' && parameters.batterySelection.model?.monthlyPrice) {
    batteryMonthlyCost = parameters.batterySelection.model.monthlyPrice;
  } else if (parameters.batterySelection?.type === 'virtual') {
    const capacity = parameters.batterySelection.virtualCapacity || 0;
    const annualPrice = capacity === 100 ? 180 :
                       capacity === 300 ? 288 :
                       capacity === 600 ? 360 : 420;
    batteryMonthlyCost = annualPrice / 12;
  } else if (parameters.batterySelection?.type === 'mybattery') {
    batteryMonthlyCost = installedPower * 1.20;
  }
  
  return baseSubscription + batteryMonthlyCost;
}