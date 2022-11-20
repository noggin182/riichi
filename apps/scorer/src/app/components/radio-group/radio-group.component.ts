import { Component, ViewEncapsulation, ChangeDetectionStrategy, forwardRef, Input, HostListener, ChangeDetectorRef, HostBinding } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

let id = 0;

@Component({
    selector: 'scorer-radio-group',
    templateUrl: './radio-group.component.html',
    styleUrls: ['./radio-group.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RadioGroupComponent),
        multi: true
    }]
})
export class RadioGroupComponent implements ControlValueAccessor {
    constructor(private readonly changeDetector: ChangeDetectorRef) {
    }

    @Input() ariaTitle: string | undefined;
    @Input() name: string | undefined;

    @Input() options: {caption: string, value: number}[] | undefined;
    value: number | undefined;
    id = ++id;

    @Input() disabled = false;
    @HostBinding('attr.disabled')
    get attrDisabled() { return this.disabled || null; }

    @HostListener('focusout')
    private onTouched = () => { /* nothing by default, will be overriden */ }
    private onChange: (value: number) => void = () => { /* nothing by default, will be overriden */ };

    writeValue(value: number): void {
        this.value = value;
        this.changeDetector.markForCheck();
    }

    registerOnChange(fn: (value: number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.changeDetector.markForCheck();
    }

    updateValue(event: Event) {
        if (event.target instanceof HTMLInputElement && event.target.checked) {
            this.value = +event.target.value;
            this.onChange(this.value);
        }
    }
}
