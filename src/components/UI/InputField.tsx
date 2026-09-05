import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {twMerge} from 'tailwind-merge'
import React, { useState } from 'react';
import Button from './Button';

type SelectOption = {
    label: string;
    value: string;
};

type BaseProps = {
    inputLabel?: string;
    label?: boolean;
    inputClassName?: string;
    className?: string;
    placeholder?: string;
    id?: string;
    value?: any;
    rows?: number;
    onChange?: any;
    inputIcon?: IconDefinition;
    iconClassName?: string;
};

type InputProps =
    | ({ type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'checkbox' | 'radio' } & React.InputHTMLAttributes<HTMLInputElement>)
    | ({ type: 'textarea' } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
    | ({ type: 'select'; options: SelectOption[] } & React.SelectHTMLAttributes<HTMLSelectElement>);

type Props = BaseProps & InputProps;

const InputField = ({
    inputLabel,
    label = false,
    type = 'text',
    inputClassName = '',
    className = 'flex w-full rounded-sm border border-zinc-deep bg-night-base py-2 px-10 text-[16px] leading-6 outline-none',
    placeholder = '',
    id = '',
    rows = 4,
    value,
    onChange,
    inputIcon,
    iconClassName,
    ...rest
}: Props) => {

    const combinedClasses = twMerge(className, inputClassName)

    const [showPassword, setShowPassword] = useState(false);

    const renderInput = () => {
    
        switch (type) {
        
            case 'textarea':
        
            return (
            
                <textarea
                    id={id}
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={combinedClasses}
                />
            
            );

            case 'select': {
            
                const selectOptions =
                    'options' in rest ? rest.options : [];
            
                return (
                    <select
                        id={id}
                        value={value}
                        onChange={onChange}
                        className={combinedClasses}
                    >
                        {selectOptions.map((option: SelectOption) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            }
        
            case 'checkbox':
            case 'radio':
                return (
                    <input
                        type={type}
                        id={id}
                        checked={Boolean(value)}
                        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
                        className={combinedClasses}
                    />
                );

            default:
            return (
            
                <input
                    type={
                        type === 'password' && showPassword
                        ? 'text'
                        : type
                    }
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={combinedClasses}
                />
            
            );
    }
    };

    return (
    
        <>
        
            { label && (
            
                <label
                    htmlFor={id}
                    className="capitalize block mb-2 font-Inter_18pt"
                >
                    {inputLabel}
                </label>
            
            ) }
        
            {/* <div className="relative"> */}
            
                {inputIcon && (
                
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    
                        <FontAwesomeIcon icon={inputIcon} className={iconClassName} />
                    
                    </div>
                
                )}
            
                {renderInput()}
            
            {type === 'password' && (
            
                <Button type='button' onClick={() => setShowPassword((prev) => !prev)} buttonClassName='absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-400' children={showPassword ? 'Hide' : 'Show'} />
            
            )}
        
        </>
    
    );

};

export default InputField;