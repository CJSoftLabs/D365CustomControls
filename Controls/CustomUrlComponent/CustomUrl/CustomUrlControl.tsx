import * as React from 'react';
import { IconButton, Stack, TextField, DefaultButton, PrimaryButton, Label, Link } from '@fluentui/react';
import { IIconProps } from '@fluentui/react/lib/Icon';

export interface CustomUrlControlProps {
    data: { url: string, text: string };
    onEdit: (data: string) => void;
    isReadOnly: boolean;
    displayAsLink: boolean;
}

interface ICustomControlState {
    isPopupVisible: boolean;
    url: string;
    text: string;
    tempUrl: string;
    tempText: string;
    urlError: string;
    textError: string;
    isReadOnly: boolean;
    displayAsLink: boolean;
}

export class CustomUrlControl extends React.Component<CustomUrlControlProps, ICustomControlState> {
    private popupRef: React.RefObject<HTMLDivElement>;

    constructor(props: CustomUrlControlProps) {
        super(props);
        this.state = {
            isPopupVisible: false,
            url: this.props.data.url,
            text: this.props.data.text,
            tempUrl: this.props.data.url,
            tempText: this.props.data.text,
            urlError: '',
            textError: '',
            isReadOnly: this.props.isReadOnly,
            displayAsLink: this.props.displayAsLink,
        };
        this.popupRef = React.createRef();
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleViewClick = this.handleViewClick.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleEditClick() {
        if(!this.state.isReadOnly){
            this.setState((prevState) => ({
                isPopupVisible: !prevState.isPopupVisible,
                tempUrl: this.state.url,
                tempText: this.state.text
            }));
        }
    }

    handleViewClick() {
        const url = this.state.url;
        // if (url && this.isValidUrl(url)) {
        if (url) {
            window.open(url, '_blank');
        }
    }

    isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    handleClickOutside(event: MouseEvent) {
        if (this.popupRef.current && !this.popupRef.current.contains(event.target as Node)) {
            this.setState({ isPopupVisible: false });
        }
    }

    handleUpdateClick() {
        const { tempUrl, tempText } = this.state;
        let urlError = '';
        let textError = '';

        if (!tempText) {
            textError = 'Text field cannot be empty.';
        }

        // if (!this.isValidUrl(tempUrl)) {
        if (!tempUrl) {
            urlError = 'Please enter a valid URL.';
        }

        if (urlError || textError) {
            this.setState({ urlError, textError });
        } else {
            this.setState({
                isPopupVisible: false,
                url: tempUrl,
                text: tempText,
                urlError: '',
                textError: '',
            });
            this.props.onEdit(JSON.stringify({ url: this.state.tempUrl, text: this.state.tempText }));
        }
    }

    handleCancelClick() {
        this.setState({ isPopupVisible: false });
    }

    horizontalStackStyles = {
        root: {
          display: 'flex',
          alignItems: 'center', // Aligns items vertically in the center
        },
    };

    requiredMarkStyles = {
        root: {
          color: 'red', // Set the color of the asterisk
          marginLeft: '2px', // Add some space between the label text and the asterisk
        },
    };

    labelStyles = {
        root: {
          marginRight: '8px', // Add some space between the label and the text box
        },
    };

    textboxStyles = {
        root: {
            flexGrow: 1,
            marginRight: '3px', // Add some space between the label and the text box
        },
    };

    render() {
        const { url, text, tempUrl, tempText, isPopupVisible, urlError, textError } = this.state;
        const globeIcon: IIconProps = { iconName: 'Globe', styles: { root: { marginRight: 5 } } };

        return (
            <Stack styles={ { root: { backgroundColor: "rgb(245, 245, 245)" } } }>
                <Stack horizontal verticalAlign='center'>
                    <Stack grow styles={ { root: { paddingLeft: 12 } } }>
                        {(!this.state.displayAsLink) &&
                            (<Label onClick={this.handleEditClick}>{ text || url }</Label>)
                        }
                        {this.state.displayAsLink &&
                            (<Link href={ url } target='_blank'>{ text || url }</Link>)
                        }
                    </Stack>
                    <Stack horizontal>
                        <IconButton iconProps={globeIcon} title="View" ariaLabel="View URL" onClick={this.handleViewClick} />
                    </Stack>
                </Stack>
                {isPopupVisible && (
                    <div ref={this.popupRef} style={{ zIndex: 1000, width: 'calc(100% - 20px)', backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}>
                        <Stack horizontal grow>
                            <Stack horizontal grow styles={this.horizontalStackStyles}>
                                <TextField styles={this.textboxStyles } label="Text" required value={tempText} onChange={(e, newValue) => this.setState({ tempText: newValue || '' })} errorMessage={textError} />
                            </Stack>
                            <Stack horizontal grow styles={this.horizontalStackStyles}>
                                <TextField styles={this.textboxStyles } label="Url" required value={tempUrl} onChange={(e, newValue) => this.setState({ tempUrl: newValue || '' })} errorMessage={urlError} />
                            </Stack>
                        </Stack>
                        <Stack horizontal horizontalAlign="end" styles={{ root: { marginTop: 10 } }}>
                            <DefaultButton text="Cancel" onClick={this.handleCancelClick} />
                            <div style={{ width: '10px' }} /> {/* Spacer */}
                            <PrimaryButton text="Update" onClick={this.handleUpdateClick} />
                        </Stack>
                    </div>
                )}
            </Stack>
        );
    }
}
