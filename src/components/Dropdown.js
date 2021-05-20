import React, {useState, useEffect, useRef} from 'react'


const Dropdown = ({options, selected, onSelectedChange, label}) => {
	const [open, setOpen] = useState(false)
	const ref = useRef()

	useEffect(() => {
		const onBodyClick = event => {
			if ((ref.current && ref.current.contains(event.target))) {
				return;
			}
			setOpen(false)
		}
		document.body.addEventListener('click', onBodyClick)
		return () => {
			document.body.removeEventListener('click', onBodyClick)
		}
	}, [])


	const renderedOptions = options.map((option) => {
		if (option.value === selected.value) {
			return null
		}
		return (
			<div key={option.value}
			     className="item"
			     onClick={() => onSelectedChange(option)}
			>
				{option.label}
			</div>
		);
	})
	return (
		<React.Fragment>
			<div className="ui form" ref={ref}>
				<div className="field">
					<label htmlFor="item" className="label">
						{label}
					</label>
					<div onClick={() => {
						console.log(`setting open to ${!open}`,)
						setOpen(!open)
					}}
					     className={`ui selection dropdown ${open ? 'visible active' : ''}`}
					>
						<i className="dropdown icon"></i>
						<div className="text">
							Selected: {selected.label}
						</div>
						<div className={`menu ${open ? 'visible transition' : ''}`}>
							{renderedOptions}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default Dropdown
