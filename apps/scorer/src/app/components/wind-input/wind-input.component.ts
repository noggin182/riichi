import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Wind } from '@riichi/common';

let id = 0;

@Component({
    selector: 'scorer-wind-input',
    templateUrl: './wind-input.component.html',
    styleUrls: ['./wind-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => WindInputComponent),
        multi: true
      }]
})
export class WindInputComponent implements ControlValueAccessor {
    wind = {
        East:  Wind.East,
        South: Wind.South,
        West:  Wind.West,
        North: Wind.North,
    };
    value: Wind | undefined;
    id = ++id;

    private onChange: ((value: Wind) => void) | undefined ;

    writeValue(wind: Wind): void {
        this.value = wind;
    }

    registerOnChange(fn: (value: Wind) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        // Nada
    }

    setDisabledState?(isDisabled: boolean): void {
        // Nada
    }

    updateValue(event: Event) {
        if (event.target instanceof HTMLInputElement && event.target.checked) {
            this.value = event.target.value as Wind;
            if (this.onChange) {
                this.onChange(this.value);
            }
        }
    }
}
