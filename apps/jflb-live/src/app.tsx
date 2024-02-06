import './app.css'
// import InputFile from './components/input-file'
// https://github.com/AndyUGA/Supabase_File_Upload_Tutorial/tree/file_upload
import { supabase } from "./lib/supabase";
import { v4 as uuidv4 } from 'uuid';
import { Component, createRef } from 'preact';
import { ChangeEvent } from 'preact/compat';

type MediaType = {name: string, metadata: {mimetype: string}, updated_at: number}

interface IAppState {
  medias: MediaType[],
  uploadedFileName: string | undefined,
  mode: 'readonly' | 'edition'
}

const bucket = 'jflb-live'
const folder = 'uploads'

export class App extends Component<{}, IAppState>  {
  constructor() {
    super();
    this.state = { medias: [], uploadedFileName: undefined, mode :'readonly'};
  }

  inputFile = createRef<HTMLInputElement>();

  handleImageChange = (e: ChangeEvent) => {
    const files = (e.target as EventTarget & { files: FileList})?.files
    if (files && files.length > 0) {
      if (this.state.uploadedFileName) this.updateImage(files)
      else this.uploadImage(files)
    }
  }

  handleReset = () => {
    if (this.inputFile.current) this.inputFile.current.value = '';
  };

  uploadImage = async (files: FileList) => {
    const file = files[0];
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload([folder,`${uuidv4()}-${file.name}`].join('/'), file)

    if (data) {
      this.setState({uploadedFileName: data.path.replace(`${folder}/`, '')})
      this.getMedia()
      
    };
    if(error) console.log(error);
    this.handleReset();
  }

  updateImage = async (files: FileList) => {
    const file = files[0];

    if (this.state.uploadedFileName) {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .update([folder,this.state.uploadedFileName].join('/'), file)
  
      if (data) console.log('update')
      if (error) console.log(error);
    }
    this.handleReset();
  }

  handleLiveClick = (e: MouseEvent) => {
    this.setState({uploadedFileName: (e.target as HTMLButtonElement).dataset.name})
  }

  handleCredentials = (e: ChangeEvent) => {
    if ((e.target as HTMLInputElement)?.value === bucket) this.setState({mode: 'edition'})
  }

  getMedia = async () => {
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 3,
      offset: 0,
      sortBy: {
        column: 'updated_at', order:
          'desc'
      }
    });

    if (data) {
      this.setState({medias: data as unknown as MediaType[]});
      this.getMedia();
    }
    if (error)console.log(71, error);
    
  }

  componentDidMount() {
    this.getMedia();
  }

  render () {
    const lastLives = this.state.medias.filter(({name}) => name !=='.emptyFolderPlaceholder')
    return (
      <>
        <h2>{this.state.uploadedFileName ? `Live en cours ${this.state.uploadedFileName}` : 'Commencer un live'}</h2>
        {
          this.state.mode === 'edition' && <input type="file" onChange={this.handleImageChange} accept=".xlsx,.xls" ref={this.inputFile} />
        }
        { this.state.mode === 'readonly' && (<label htmlFor="credentials">Authentification
            <input style="margin-left: 4px;" id="credentials" name="credentials" type="text" onInput={this.handleCredentials}></input>
          </label>)
        }
        {
          lastLives.length > 0 && ([
            <h2>Mes derniers live</h2>,
            <ul>
              {lastLives.map((media) => (
                <li>
                  <span>
                  {new Date(media.updated_at).toLocaleString()} - &nbsp;
                    <a target="_blank" type={media.metadata.mimetype} href={`${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/${bucket}/${folder}/${media.name}`}>{media.name}</a>
                    {
                      this.state.mode === 'edition' && <button onClick={this.handleLiveClick} data-name={media.name}>Continuer le live</button>
                    }
                  </span>
                </li>))}
            </ul>
          ])
        }
      </>
    )
  }
}
