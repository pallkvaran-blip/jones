import type { GameState } from '../../state/types'
import { formatMoney, formatTime, dayName } from '../../utils/format'
import { CAREER_JOBS, LOCATION_JOBS } from '../../data/jobs'
import { getHousingTier } from '../../data/housing'

function getBarClass(value: number): string {
  if (value >= 60) return 'high';
  if (value >= 30) return 'mid';
  return 'low';
}


export class StatsPanel {
  private el: HTMLElement;

  constructor() {
    this.el = document.createElement('div');
    this.el.id = 'stats-panel';
    this.el.innerHTML = this.buildHTML();
  }

  private buildHTML(): string {
    return `
      <div class="panel-title">
        HUSTLE CITY
        <small>LIFE IN THE FAST LANE</small>
      </div>

      <div class="sp-columns">
        <div class="sp-col sp-col-left">
          <div class="stat-row">
            <span class="stat-label">Week</span>
            <span class="stat-value" id="sp-week">1 / 24</span>
          </div>

          <div class="day-indicator" id="sp-day-dots">
            ${[1,2,3,4,5,6,7].map(i => `<div class="day-dot${i === 1 ? ' active' : ''}" data-day="${i}"></div>`).join('')}
          </div>

          <div class="stat-row">
            <span class="stat-label">Day</span>
            <span class="stat-value" id="sp-day-name">Monday</span>
          </div>

          <div class="stat-row">
            <span class="stat-label">Time</span>
            <span class="stat-value" id="sp-time">8:00 AM</span>
          </div>

          <div class="bar-container" title="Time remaining today">
            <div class="bar-fill time-bar" id="sp-time-bar" style="width:100%"></div>
          </div>

          <hr class="section-divider" />

          <div class="stat-row">
            <span class="stat-label">Cash</span>
            <span class="stat-value money" id="sp-money">$500.00</span>
          </div>

          <div class="stat-row">
            <span class="stat-label">Bank</span>
            <span class="stat-value" id="sp-bank">$0.00</span>
          </div>

          <div class="stat-row" id="sp-portfolio-row" style="display:none">
            <span class="stat-label">Stocks</span>
            <span class="stat-value" id="sp-portfolio" style="color:#4a90d9">$0.00</span>
          </div>

          <div class="stat-row" id="sp-debt-row" style="display:none">
            <span class="stat-label">Debt</span>
            <span class="stat-value" id="sp-debt" style="color:#e74c3c">$0.00</span>
          </div>

          <div class="stat-row">
            <span class="stat-label">Net Worth</span>
            <span class="stat-value" id="sp-networth" style="color:#ffd24a">$0</span>
          </div>
        </div>

        <div class="sp-col sp-col-right">
          <div class="stat-row">
            <span class="stat-label">Location</span>
            <span class="stat-value location-name" id="sp-location">Your Apartment</span>
          </div>

          <div class="stat-row">
            <span class="stat-label">Job</span>
            <span class="stat-value" id="sp-job">Unemployed</span>
          </div>

          <div class="stat-row">
            <span class="stat-label">Edu</span>
            <span class="stat-value" id="sp-education" style="color:#a0c8f8">0.0</span>
          </div>

          <div class="stat-row">
            <span class="stat-label">Home</span>
            <span class="stat-value" id="sp-housing" style="color:#9ab4d6">Basic Apartment</span>
          </div>

          <hr class="section-divider" />

          <div class="stat-label" style="margin-bottom:4px">NEEDS</div>
          <div class="needs-section">
            <div class="need-row">
              <span class="need-icon">&#x1F34E;</span>
              <span class="need-label">Hunger</span>
              <div class="need-bar-wrap">
                <div class="bar-container">
                  <div class="bar-fill high" id="sp-hunger-bar" style="width:80%"></div>
                </div>
              </div>
              <span class="need-val" id="sp-hunger-val">80</span>
            </div>
            <div class="need-row">
              <span class="need-icon">&#x26A1;</span>
              <span class="need-label">Energy</span>
              <div class="need-bar-wrap">
                <div class="bar-container">
                  <div class="bar-fill high" id="sp-energy-bar" style="width:80%"></div>
                </div>
              </div>
              <span class="need-val" id="sp-energy-val">80</span>
            </div>
            <div class="need-row">
              <span class="need-icon">&#x2764;&#xFE0F;</span>
              <span class="need-label">Health</span>
              <div class="need-bar-wrap">
                <div class="bar-container">
                  <div class="bar-fill high" id="sp-health-bar" style="width:80%"></div>
                </div>
              </div>
              <span class="need-val" id="sp-health-val">80</span>
            </div>
            <div class="need-row">
              <span class="need-icon">&#x1F60A;</span>
              <span class="need-label">Morale</span>
              <div class="need-bar-wrap">
                <div class="bar-container">
                  <div class="bar-fill high" id="sp-morale-bar" style="width:80%"></div>
                </div>
              </div>
              <span class="need-val" id="sp-morale-val">80</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getElement(): HTMLElement {
    return this.el;
  }

  update(state: GameState): void {
    const { player, calendar, currentLocationId } = state;

    const weekEl = this.el.querySelector('#sp-week');
    if (weekEl) weekEl.textContent = `${calendar.week} / ${calendar.maxWeeks}`;

    const dayNameEl = this.el.querySelector('#sp-day-name');
    if (dayNameEl) dayNameEl.textContent = dayName(calendar.day);

    const timeEl = this.el.querySelector('#sp-time');
    if (timeEl) timeEl.textContent = formatTime(calendar.timeUnits);

    const timeBarEl = this.el.querySelector<HTMLElement>('#sp-time-bar');
    if (timeBarEl) {
      timeBarEl.style.width = `${calendar.timeUnits}%`;
    }

    const moneyEl = this.el.querySelector('#sp-money');
    if (moneyEl) moneyEl.textContent = formatMoney(player.money);

    const bankEl = this.el.querySelector('#sp-bank');
    if (bankEl) bankEl.textContent = formatMoney(player.bankBalance);

    const portfolioValue = Object.entries(player.portfolio).reduce(
      (sum, [stock, shares]) => sum + shares * (state.economy.stockPrices[stock] ?? 0), 0
    );
    const portfolioRow = this.el.querySelector<HTMLElement>('#sp-portfolio-row');
    const portfolioEl = this.el.querySelector('#sp-portfolio');
    if (portfolioRow) portfolioRow.style.display = portfolioValue > 0 ? '' : 'none';
    if (portfolioEl) portfolioEl.textContent = formatMoney(portfolioValue);

    const debtRow = this.el.querySelector<HTMLElement>('#sp-debt-row');
    const debtEl = this.el.querySelector('#sp-debt');
    if (debtRow) debtRow.style.display = player.debt > 0 ? '' : 'none';
    if (debtEl) debtEl.textContent = formatMoney(player.debt);

    const locationEl = this.el.querySelector('#sp-location');
    if (locationEl) locationEl.textContent = currentLocationId.replace(/_/g, ' ');

    // Day dots
    const dots = this.el.querySelectorAll('.day-dot');
    dots.forEach((dot, i) => {
      const dayNum = i + 1;
      dot.classList.remove('active', 'past');
      if (dayNum === calendar.day) dot.classList.add('active');
      else if (dayNum < calendar.day) dot.classList.add('past');
    });

    // Needs bars
    const needs: Array<{ id: string; valId: string; value: number }> = [
      { id: 'sp-hunger-bar', valId: 'sp-hunger-val', value: player.hunger },
      { id: 'sp-energy-bar', valId: 'sp-energy-val', value: player.energy },
      { id: 'sp-health-bar', valId: 'sp-health-val', value: player.health },
      { id: 'sp-morale-bar', valId: 'sp-morale-val', value: player.morale },
    ];

    for (const need of needs) {
      const el = this.el.querySelector<HTMLElement>(`#${need.id}`);
      if (el) {
        el.style.width = `${need.value}%`;
        el.className = `bar-fill ${getBarClass(need.value)}`;
      }
      const valEl = this.el.querySelector<HTMLElement>(`#${need.valId}`);
      if (valEl) valEl.textContent = Math.round(need.value).toString();
    }

    // Education counter
    const eduEl = this.el.querySelector<HTMLElement>('#sp-education');
    if (eduEl) eduEl.textContent = player.education.toFixed(1);

    // Job display — prefer location-specific titles, fall back to CAREER_JOBS
    const jobEl = this.el.querySelector('#sp-job');
    if (jobEl) {
      if (player.jobId && player.jobRank >= 1) {
        const locJob = LOCATION_JOBS[player.jobId as import('../../state/types').LocationId];
        if (locJob) {
          jobEl.textContent = locJob.titles[player.jobRank - 1] ?? 'Unemployed';
        } else if (player.careerTrack) {
          const tier = CAREER_JOBS[player.careerTrack].tiers[player.jobRank - 1];
          jobEl.textContent = tier ? tier.title : 'Unemployed';
        } else {
          jobEl.textContent = 'Unemployed';
        }
      } else {
        jobEl.textContent = 'Unemployed';
      }
    }

    // Housing
    const housingEl = this.el.querySelector<HTMLElement>('#sp-housing');
    if (housingEl) {
      const tier = getHousingTier(player.housingId);
      const name = tier?.name ?? player.housingId.replace(/_/g, ' ');
      housingEl.textContent = name;
      housingEl.style.color = '#9ab4d6';
    }

    const networthEl = this.el.querySelector<HTMLElement>('#sp-networth');
    if (networthEl) {
      const { player, economy } = state;
      const portfolioValue = Object.entries(player.portfolio).reduce(
        (sum, [stock, shares]) => sum + shares * (economy.stockPrices[stock] ?? 0), 0
      );
      const netWorth = player.money + player.bankBalance + portfolioValue - player.debt;
      networthEl.textContent = formatMoney(netWorth);
      networthEl.style.color = netWorth >= 0 ? '#ffd24a' : '#e74c3c';
    }
  }

  updateLocationName(name: string): void {
    const locationEl = this.el.querySelector('#sp-location');
    if (locationEl) locationEl.textContent = name;
  }
}
