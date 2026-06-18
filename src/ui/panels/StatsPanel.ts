import type { GameState } from '../../state/types'
import { formatMoney, formatTime, dayName } from '../../utils/format'
import { CAREER_JOBS, LOCATION_JOBS } from '../../data/jobs'

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
        JONES
        <small>LIFE IN THE FAST LANE</small>
      </div>

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
        <span class="stat-label">Location</span>
        <span class="stat-value location-name" id="sp-location">Your Apartment</span>
      </div>

      <div class="stat-row">
        <span class="stat-label">Job</span>
        <span class="stat-value" id="sp-job">Unemployed</span>
      </div>

      <div class="stat-row">
        <span class="stat-label">Goals</span>
        <span class="stat-value" id="sp-goals">&#x25CB; &#x25CB; &#x25CB; &#x25CB;</span>
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
        </div>
        <div class="need-row">
          <span class="need-icon">&#x26A1;</span>
          <span class="need-label">Energy</span>
          <div class="need-bar-wrap">
            <div class="bar-container">
              <div class="bar-fill high" id="sp-energy-bar" style="width:80%"></div>
            </div>
          </div>
        </div>
        <div class="need-row">
          <span class="need-icon">&#x2764;&#xFE0F;</span>
          <span class="need-label">Health</span>
          <div class="need-bar-wrap">
            <div class="bar-container">
              <div class="bar-fill high" id="sp-health-bar" style="width:80%"></div>
            </div>
          </div>
        </div>
        <div class="need-row">
          <span class="need-icon">&#x1F60A;</span>
          <span class="need-label">Morale</span>
          <div class="need-bar-wrap">
            <div class="bar-container">
              <div class="bar-fill high" id="sp-morale-bar" style="width:80%"></div>
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
    const needs: Array<{ id: string; value: number }> = [
      { id: 'sp-hunger-bar', value: player.hunger },
      { id: 'sp-energy-bar', value: player.energy },
      { id: 'sp-health-bar', value: player.health },
      { id: 'sp-morale-bar', value: player.morale },
    ];

    for (const need of needs) {
      const el = this.el.querySelector<HTMLElement>(`#${need.id}`);
      if (el) {
        el.style.width = `${need.value}%`;
        el.className = `bar-fill ${getBarClass(need.value)}`;
      }
    }

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

    // Goals indicators
    const goalsEl = this.el.querySelector('#sp-goals');
    if (goalsEl) {
      const { goalsMet } = state;
      const met = '#2ECC71';
      const unmet = '#5a5a72';
      const dot = (isMet: boolean) =>
        `<span style="color:${isMet ? met : unmet}">${isMet ? '&#x25CF;' : '&#x25CB;'}</span>`;
      goalsEl.innerHTML = [
        dot(goalsMet.targetWealth),
        dot(goalsMet.targetEducation),
        dot(goalsMet.targetCareerRank),
        dot(goalsMet.targetHappiness),
      ].join(' ');
    }
  }

  updateLocationName(name: string): void {
    const locationEl = this.el.querySelector('#sp-location');
    if (locationEl) locationEl.textContent = name;
  }
}
