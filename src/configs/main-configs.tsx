import { createContext, FC, useContext, ReactNode } from 'react';

import { generateID } from '@components/tree';
import jMoment, { Moment } from 'moment-jalaali';

//import '../../public/widget_api_func.js';
//import { navigateLink } from '../../public/widget_api_func.js';


interface FieldDefaultProperties<R, F extends keyof R = keyof R> {
  name: F;
  initialValue: R[F];
  label: string;
  isRequired: boolean;
  isSearchable: boolean;
  validationFunc?: <T = R[F]>(value?: T) => boolean;
}

interface TextField {
  type: 'text' | 'number' | 'color';
  multiline: boolean;
}

interface CheckboxField {
  type: 'checkbox';
}

interface SelectField {
  type: 'select';
  selectType: 'single' | 'multiple';
  options: Array<{ value: string; label: string }>;
}

interface DateTimeField {
  type: 'date' | 'time' | 'dateTime';
}

type AllFields = TextField | SelectField | CheckboxField | DateTimeField;

export type Fields<
  R = SedrahNodeData,
  F extends keyof R = keyof R
> = F extends keyof R ? FieldDefaultProperties<R, F> & AllFields : never;

interface DefaultFields {
  id: string; // Unique id of node. Never remove this field.
  nodeType: NodeTypes; // Type of Node. Never remove this field.
  name: string; // Primary field. Never remove this field.
}

type DefaultNodeType = 'simple';

interface ConfigContextInterface {
  treeNodes: {
    [NodeType in NodeTypes]: {
      nodeView: (node: SedrahNodeData) => ReactNode;
      fields: Array<Fields>;
      onUpdateNode?: (nodeData?: SedrahNodeData) => void;
    };
  };
  initialTree: Array<SedrahNodeData>;
  nodeTypes: Array<{ value: NodeTypes; label: string }>;
  primaryField: keyof SedrahNodeData;
  mainFunctions: MainFunctionsInterface;
  generateNewNode: (type: NodeTypes) => SedrahNodeData;
  appTitle: string;
}

interface MainFunctionsInterface {
  [func: string]: {
    label: string;
    cb: (
      selectedNodes: Array<SedrahNodeData>,
      options?: { [key: string]: unknown },
    ) => void;
  };
}

const generateNewNode = (type: NodeTypes): SedrahNodeData => {
  const fields = mainConfigs.treeNodes[type].fields;
  return fields.reduce(
    (res, field) => {
      return {
        ...res,
        [field.name]: field.initialValue,
      };
    },
    { id: generateID(), nodeType: type } as SedrahNodeData,
  );
};

/* *** DO NOT CHANGE ANYTHING UPPER THAN HERE *** */
/* ***                                        *** */
/* ***                                        *** */
/* ***                                        *** */

// Deiffernt Node types. Do not remove DefaultNodeType
export type NodeTypes = DefaultNodeType | 'project' | 'madreseh';

// Add new field and its type in this interface
export interface NodeFields extends DefaultFields {
  element_user?: string;
  tags?: Array<string>;
  admin?: string;
  priority?: string;
  element_user_admin?: string;
  color?: string;
  dateAndTime?: Moment;
}

// Main project callback functions
const mainFunctions: MainFunctionsInterface = {
  send_message: {
    label: 'ارسال پیام گروهی',
    cb: (selectedNodes, { toggleMessageFormAlert }) => {
      if (selectedNodes.length > 0) {
        toggleMessageFormAlert();
      }
    },
  },
  send_individual_message: {
    label: 'ارسال پیام شخصی',
    cb: (selectedNodes) => {
      if (selectedNodes.length > 0) {
        send_individual_message(selectedNodes);
      }
    },
  },
  live_stream: {
    label: 'ایجاد پخش زنده',
    cb: (selectedNodes) => {
      console.log(selectedNodes);
    },
  },
  group_meeting: {
    label: 'ایجاد جلسه گفتگو',
    cb: (selectedNodes) => {
      console.log(selectedNodes);
    },
  },
};

// Main project config files
const mainConfigs: ConfigContextInterface = {
  treeNodes: {
    simple: {
      fields: [
        {
          name: 'name',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام فرد',
          isRequired: true, // Field need to be validated or not
          isSearchable: true,
        },
        {
          name: 'element_user',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام کاربری در المنت',
          isRequired: true, // Field need to be validated or not
          isSearchable: true,
        },
        {
          name: 'tags',
          selectType: 'multiple', // Can be one of 'multiple' | 'single'
          initialValue: ['معارف# '], // If select type is 'multiple' then "initialValue" should be an array of values
          type: 'select',
          label: 'گروه‌ها',
          options: [
            { value: 'فیلم‌سازی# ', label: 'فیلم‌سازی' },
            { value: 'معارف# ', label: 'معارف' },
            { value: 'معماری# ', label: 'معماری' },
            { value: 'منظومه# ', label: 'منظومه' },
          ],
          isRequired: false,
          isSearchable: true,
        },
      ],
      nodeView: function SimpleNodeView(node) {
        return (
          <div>
            <span>گروهها - </span>
            <span>{node.tags}</span>
            <button
              onClick={() =>
                navigateLink(
                  'https://matrix.to/#/#livestream:quranic.network?via=quranic.network',
                )
              }
            >
              ورود
            </button>
          </div>
        );
      },
      onUpdateNode: (v) => console.log(v), // Callback when node updated
    },
    madreseh: {
      fields: [
        {
          name: 'name',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام گروه',
          isRequired: true, // Field need to be validated or not
          isSearchable: true,
        },
        {
          name: 'element_user',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام کاربری در المنت',
          isRequired: true, // Field need to be validated or not
          isSearchable: true,
        },
        {
          name: 'admin',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام مسئول',
          isRequired: true, // Field need to be validated or not
          isSearchable: true,
        },
        {
          name: 'element_user_admin',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام کاربری مسئول در المنت',
          isRequired: true, // Field need to be validated or not
          isSearchable: true,
        },
        {
          name: 'tags',
          selectType: 'multiple', // Can be one of 'multiple' | 'single'
          initialValue: ['admin'], // If select type is 'multiple' then "initialValue" should be an array of values
          type: 'select',
          label: 'گروه‌ها',
          options: [
            { value: 'فیلم‌سازی# ', label: 'فیلم‌سازی' },
            { value: 'معارف# ', label: 'معارف' },
            { value: 'معماری# ', label: 'معماری' },
          ],
          isRequired: false,
          isSearchable: true,
        },
      ],
      nodeView: function MadresehNodeView(node) {
        return (
          <div>
            <span>مسئول - </span>
            <span>{node.admin}</span>
          </div>
        );
      },
      onUpdateNode: (v) => console.log(v), // Callback when node updated
    },
    project: {
      fields: [
        {
          name: 'name',
          initialValue: '',
          multiline: false, // If true, a "textarea" element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام',
          isRequired: true, // Field is required or not
          isSearchable: true,
        },
        {
          name: 'element_user',
          initialValue: '',
          multiline: false, // If true, a textarea element will be rendered instead of an input
          type: 'text', // Can be one of 'text' | 'number' | 'checkbox' | 'select' | 'color' | 'date' | 'time' | 'dateTime'
          label: 'نام کاربری در المنت',
          isRequired: true, // Field need to be validated or not
          isSearchable: true,
        },
        {
          name: 'priority',
          selectType: 'single', // Can be one of 'multiple' | 'single'
          initialValue: 'reg', // If select type is 'multiple' then "initialValue" should be an array of values
          type: 'select',
          label: 'اولویت',
          options: [
            { value: 'مهم', label: 'مهم' },
            { value: 'عادی', label: 'عادی' },
            { value: 'بسیار مهم', label: 'بسیار مهم' },
          ],
          isRequired: false,
          isSearchable: true,
        },
        {
          name: 'color',
          initialValue: '',
          multiline: false,
          type: 'color',
          label: 'رنگ',
          isRequired: false,
          isSearchable: true,
        },
        {
          name: 'dateAndTime',
          initialValue: jMoment(),
          type: 'dateTime',
          label: 'مهلت',
          isRequired: false,
          isSearchable: true,
        },
      ],
      nodeView: function ProjectNodeView(node) {
        return (
          <div style={{ color: node.color }}>
            <span>پروژه - </span>
            {node.priority}
          </div>
        );
      },
      onUpdateNode: (v) => console.log(v), // Callback when node updated
    },
  },
  initialTree: [
    {
      name: 'عبد',
      element_user: '!CpnaMFWBRQluWOdsBm:quranic.network',
      id: '!test:quranic.network',
      tags: ['معارف# '],
      nodeType: 'simple',
    },
  ],
  nodeTypes: [
    { value: 'simple', label: 'فرد' },
    { value: 'project', label: 'پروژه' },
    { value: 'madreseh', label: 'گروه' },
  ],
  primaryField: 'name',
  mainFunctions,
  generateNewNode,
  appTitle: 'بسم الله الرحمن الرحیم',
};

const ConfigsContext = createContext(mainConfigs);

export const Configs: FC = ({ children }) => {
  return (
    <ConfigsContext.Provider value={mainConfigs}>
      {children}
    </ConfigsContext.Provider>
  );
};

export const useConfigs = (): ConfigContextInterface => {
  return useContext(ConfigsContext);
};
