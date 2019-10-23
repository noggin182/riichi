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
    value: Wind;
    id = ++id;

    private onChange: (value: Wind) => void;

    writeValue(wind: Wind): void {
        this.value = wind;
    }

    registerOnChange(fn: (value: Wind) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        // Nada
    }

    setDisabledState?(isDisabled: boolean): void {
        // Nada
    }

    updateValue(event: {target: HTMLInputElement }) {
        if (event.target.checked) {
            this.value = +event.target.value as Wind;
            if (this.onChange) {
                this.onChange(this.value);
            }
        }
    }
}
