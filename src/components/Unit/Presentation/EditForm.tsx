import * as React from 'react';
import { reduxForm, InjectedFormProps, Field, GenericField, WrappedFieldProps, WrappedFieldMetaProps } from 'redux-form';
import * as unit from '../store';
import { Breadcrumbs, Content, PageTitle } from 'src/components/layout';
import { Section, Input, Textarea } from 'rivet-react';
import { TextProps } from 'rivet-react/build/dist/components/Input/common';

// Validation
const required = (value:any) => value ? undefined : "This field is required.";

var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;

const validURL = (str: string) =>
  urlregex.test(str.trim()) ? undefined : "Please enter a valid URL (ex: https://domain.iu.edu).";

const resolveVariant = (meta:WrappedFieldMetaProps) =>
    meta.pristine
    ? undefined
    : meta.error ? "invalid" : meta.warning ? "warning" : "valid" 

const resolveNote = (meta: WrappedFieldMetaProps) => 
    meta.pristine
    ? undefined
    : meta.error || meta.warning || undefined
    
const RivetInputField = Field as new () => GenericField<React.InputHTMLAttributes<HTMLInputElement> & TextProps>;
const RivetInput: React.SFC<WrappedFieldProps & React.InputHTMLAttributes<HTMLInputElement> & TextProps> = props => {
    return <Input 
        type="text" 
        label={props.label} 
        variant={resolveVariant(props.meta)} 
        note={resolveNote(props.meta)} 
        {...props.input } />;  
}

const RivetTextareaField = Field as new () => GenericField<React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextProps>;
const RivetTextarea: React.SFC<WrappedFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextProps> = props => {
    return <Textarea 
        label={props.label}
        variant={resolveVariant(props.meta)}
        note={resolveNote(props.meta)}
        {...props.input } />;  
}

interface IOwnProps {
    save: typeof unit.saveRequest;
    cancel: typeof unit.cancel;
}


interface IFormProps extends
    IFormData, IOwnProps, InjectedFormProps<IFormData, IOwnProps> { }

const EditForm: React.SFC<IFormProps> = props => {


    return <>
        <Breadcrumbs
            crumbs={[
                { text: "Home", href: "/" },
                { text: "Units", href: "/units" },
                props.name
            ]}
        />
        <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl" >
            <PageTitle>Edit</PageTitle>

            <Section>
                <form onSubmit={props.handleSubmit}>
                    {props.description && (
                        <div className="group-describer rvt-m-bottom-md">
                            <span>{props.description}</span>
                        </div>
                    )}
                    <div>
                        <RivetTextareaField name="description" value="foo" label="Description" component={RivetTextarea} defaultValue="existing description" />
                    </div>
                    <div>
                        <RivetInputField name="rivet" value="bar" label="URL" note="this is a note" variant="info" component={RivetInput} defaultValue="http://example.com"  />
                    </div>
                    <div>
                        <Field name="test" value="test" component={ (props:any) => {console.log(props); return <input type="text"/>; }} />
                    </div>
                    <div>
                        <Field name="test2" value="test2" component="input" />
                    </div>
                    <div>
                        <div>
                            <button onClick={props.cancel}>Cancel</button>
                        </div>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </Section>
        </Content>
    </>
}
export default reduxForm<IFormData, IOwnProps>({
    // a unique name for the form
    form: 'editUnit'
})(EditForm)