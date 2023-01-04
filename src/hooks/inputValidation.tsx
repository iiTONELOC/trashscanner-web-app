import { useState } from 'react';
import { validators } from '../utils';

//  Types
export interface IValidationRules {
    username: { rule: (value: string) => boolean, message: string }[];
    password: { rule: (value: string) => boolean, message: string }[];
    email: { rule: (value: string) => boolean, message: string }[];
}

// Predefined validation rules
const validationRules = {
    username: [
        { rule: validators.isAlphaNumeric, message: 'Must be alpha-numeric' },
        { rule: validators.isMoreThan3LessThan20, message: 'Must be between 3 and 20 characters' },
        { rule: validators.hasNoWhiteSpace, message: 'Cannot contain white-space' },
        { rule: validators.required, message: 'Required' }
        // TODO: add rule to check if username is unique
    ],
    password: [
        { rule: validators.isMoreThan8LessThan20, message: 'Must be between 8 and 20 characters' },
        { rule: validators.hasNoWhiteSpace, message: 'Cannot contain white-space' },
        { rule: validators.hasSpecialCharacter, message: 'Must have at least one special character' },
        { rule: validators.hasUpperCase, message: 'Must have at least one uppercase letter' },
        { rule: validators.hasLowerCase, message: 'Must have at least one lowercase letter' },
        { rule: validators.hasNumber, message: 'Must have at least one number' },
        { rule: validators.required, message: 'Required' }
    ],
    email: [
        { rule: validators.isLessThan150, message: 'Must be less than 150 characters' },
        { rule: validators.isEmail, message: 'Must be a valid email address' },
        { rule: validators.required, message: 'Required' }
        // TODO: add rule to check if email is unique
    ]
};

export interface IValidatorProps {
    value: string | null;
    property: keyof IValidationRules;
}

export interface IValidationError {
    [key: string]: string;
}

export default function useValidators(props: IValidatorProps) {
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState<IValidationError[]>([]);

    const validate = () => {
        const rules = validationRules[props.property];
        let _errors: IValidationError[] = [];
        for (const { rule, message } of rules) {
            const didPass = rule(props.value || '');

            if (!didPass) {
                _errors.push({ [props.property]: message });
            } else {
                _errors = _errors.filter((e) => e[props.property] !== message);
            }
        }

        if (_errors.length === 0) {
            setValidated(true);
        } else {
            setValidated(false);
        }
        setError(_errors);
    };

    return {
        validated: validated && error.length === 0,
        error,
        validate
    };
};

