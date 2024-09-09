import React from 'react'
import { Select, Fieldset } from './styled'

type SelectorType = {
    label?: string,
    options: string[],
    selectedOption: string;
    handleGlobalState: (value: string) => void
}

const Selector: React.FC<SelectorType> = (props) => {
    const { options, selectedOption, handleGlobalState, label } = props;
    const [activeOption, setActionOption] = React.useState<string>(selectedOption);

    const handleSelectOption = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        if (typeof value === "string") {
            setActionOption(value);
            handleGlobalState(value);
        }
    }

    return (
        <Fieldset>
            {label && <label>{label}</label>}
            <Select onChange={handleSelectOption} value={activeOption}>
                {
                    options.map(option => {
                        return (
                            <option
                                key={React.useId()}
                                value={option.toLocaleLowerCase()}
                            >
                                {option}
                            </option>
                        )
                    })
                }
            </Select>
        </Fieldset>
    )
}

export default Selector