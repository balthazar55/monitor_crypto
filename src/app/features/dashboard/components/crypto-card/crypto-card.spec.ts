import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoCard } from './crypto-card';

describe('CryptoCard', () => {
  let component: CryptoCard;
  let fixture: ComponentFixture<CryptoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
