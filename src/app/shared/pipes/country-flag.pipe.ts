import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryFlag',
  standalone: true,
})
export class CountryFlagPipe implements PipeTransform {
  private readonly flags: Record<string, string> = {
    'NED': '🇳🇱',
    'GBR': '🇬🇧',
    'ESP': '🇪🇸',
    'AUS': '🇦🇺',
    'FRA': '🇫🇷',
    'GER': '🇩🇪',
    'CAN': '🇨🇦',
    'JPN': '🇯🇵',
    'THA': '🇹🇭',
    'ITA': '🇮🇹',
    'BRA': '🇧🇷',
    'NZL': '🇳🇿',
    'MON': '🇲🇨',
    'ARG': '🇦🇷',
    'MEX': '🇲🇽',
    'CHN': '🇨🇳',
    'USA': '🇺🇸',
    'AUT': '🇦🇹',
    'BRN': '🇧🇭',
    'KSA': '🇸🇦',
    'HUN': '🇭🇺',
    'BEL': '🇧🇪',
    'AZE': '🇦🇿',
    'SGP': '🇸🇬',
    'QAT': '🇶🇦',
    'UAE': '🇦🇪'
    // 'UKW': '🏁',
  }

  transform(country: string): string {
    if (!country) return '🏁';
    return this.flags[country] || '🏁';
  }
}
