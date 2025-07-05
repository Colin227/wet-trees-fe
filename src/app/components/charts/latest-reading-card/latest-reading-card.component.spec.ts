import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LatestReadingCardComponent } from './latest-reading-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { LatestReading } from '@models';

describe('LatestReadingCardComponent', () => {
  let component: LatestReadingCardComponent;
  let fixture: ComponentFixture<LatestReadingCardComponent>;

  const mockReading: LatestReading = {
    temperature: 22.5,
    humidity: 60,
    moisture: 45,
    recordedAt: new Date().toISOString(),
    zone: {
      id: 1,
      name: 'Test Zone'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatIconModule, MatTooltipModule, LatestReadingCardComponent],
      declarations: [],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(LatestReadingCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the zone name, temperature, humidity, and moisture', () => {
    component.latest = mockReading;
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Latest Soil Reading');
    expect(textContent).toContain('Test Zone');
    expect(textContent).toContain('22.5°C');
    expect(textContent).toContain('60%');
    expect(textContent).toContain('45%');
  });

  it('should show online icon if reading is recent', () => {
    component.latest = { ...mockReading, recordedAt: new Date().toISOString() };
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('.sensor-online'));
    expect(icon).toBeTruthy();
  });

  it('should show offline icon if reading is older than 10 minutes', () => {
    const pastDate = new Date(Date.now() - 11 * 60 * 1000).toISOString();
    component.latest = { ...mockReading, recordedAt: pastDate };
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('.sensor-offline'));
    expect(icon).toBeTruthy();
  });

  describe('isOnline()', () => {
    it('should return true for a timestamp within the last 10 minutes', () => {
      const recentTime = new Date().toISOString();
      expect(component.isOnline(recentTime)).toBeTrue();
    });

    it('should return false for a timestamp older than 10 minutes', () => {
      const oldTime = new Date(Date.now() - 11 * 60 * 1000).toISOString();
      expect(component.isOnline(oldTime)).toBeFalse();
    });

    it('should return false if lastSeen is undefined', () => {
      expect(component.isOnline(undefined)).toBeFalse();
    });
  });
});
