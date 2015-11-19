from nbconvert.preprocessors import Preprocessor


class StripOutput(Preprocessor):
    """
    Clear prompt number and output (if any) from all notebook cells.

    Example
    -------
    # command line usage:
    jupyter nbconvert example.ipynb --pre=nbexample.strip_output.StripOutput
    """
    def preprocess_cell(self, cell, resources, index):
        """
        Clear prompt number and output (if any) from cell.
        """
        if 'outputs' in cell:
            cell['outputs'] = []
        if 'prompt_number' in cell:
            cell['prompt_number'] = None
        return cell, resources
