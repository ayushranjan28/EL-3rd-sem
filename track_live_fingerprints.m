    % Real-time Water Quality Monitoring - Separate Factory Tracking
% This script visualizes live data for *each factory* in its own subplot.
% It CLEARLY distinguishes between the 'Fingerprint Baseline' (Dotted)
% and the 'Live Real Data' (Solid, Thick, Moving).

data_file = 'c:\Users\ayush\Desktop\Main EL 3rd sem\live_factory_data.csv';
fp_file = 'c:\Users\ayush\Desktop\Main EL 3rd sem\factory_fingerprints.json';

% --- Load Fingerprint Baselines ---
if isfile(fp_file)
    fid = fopen(fp_file); 
    str = char(fread(fid,inf)'); 
    fclose(fid); 
    fingerprints = jsondecode(str);
else
    error('Fingerprint file not found!');
end

% Initialize large figure
f = figure('Name', 'Multi-Factory Fingerprint Tracking', ...
           'NumberTitle', 'off', 'Color', 'w', ...
           'Units', 'normalized', 'OuterPosition', [0 0 1 1]); % Full screen

% List of targeted factories to show (Top 5 busiest ones typically)
% We will create a subplot for each: 3 rows, 2 columns (or dynamic)
target_factories = {'CH_1', 'CH_2', 'TX_A', 'TX_B', 'TX_C'};
num_charts = length(target_factories);

% Colors for visualization
colors = containers.Map();
colors('CH_1') = [0.8 0 0];     % Dark Red
colors('CH_2') = [0.8 0 0.8];   % Magenta
colors('TX_A') = [0 0 0.8];     % Dark Blue
colors('TX_B') = [0 0.5 1];     % Light Blue
colors('TX_C') = [0 0.7 0];     % Green

% Store handles
axes_list = containers.Map();
baselines_cond = containers.Map();
baselines_turb = containers.Map();
lines_cond = containers.Map();
lines_turb = containers.Map();

% CSV ID Mapping (Matlab structure fields replace - with _)
csv_map = containers.Map();
csv_map('CH-1') = 'CH_1';
csv_map('CH-2') = 'CH_2';
csv_map('TX-A') = 'TX_A';
csv_map('TX-B') = 'TX_B';
csv_map('TX-C') = 'TX_C';

% === SETUP PLOTS ===
for i = 1:num_charts
    fn = target_factories{i};
    raw_name = strrep(fn, '_', '-'); % Display name
    
    % Create Subplot (2 columns, N/2 rows)
    ax = subplot(ceil(num_charts/2), 2, i);
    axes_list(fn) = ax;
    
    title(ax, ['Factory: ' raw_name ' (Live Tracking)'], 'FontSize', 12, 'FontWeight', 'bold');
    ylabel(ax, 'Parameter Value');
    xlabel(ax, 'Time (Seconds)');
    grid(ax, 'on'); 
    hold(ax, 'on');
    
    % Get Baseline Data
    if isfield(fingerprints, fn)
        data = fingerprints.(fn);
        base_cond = data.raw.conductivity_us_cm;
        base_turb = data.raw.turbidity_ntu;
    else
        % Fallback for safety
        base_cond = 0; base_turb = 0; 
    end
    
    % --- PLOT BASELINES (Dotted, distinct, with labels) ---
    % Conductivity Baseline (Gray Dotted)
    yline_c = line(ax, [0 100000], [base_cond base_cond], 'Color', [0.4 0.4 0.4], ...
         'LineStyle', ':', 'LineWidth', 2);
    text(ax, 10, base_cond, '\leftarrow Ref Conductivity', 'VerticalAlignment', 'bottom', 'Color', [0.4 0.4 0.4], 'FontSize', 8);
    
    % Turbidity Baseline (Black Dotted)
    yline_t = line(ax, [0 100000], [base_turb base_turb], 'Color', [0 0 0], ...
         'LineStyle', ':', 'LineWidth', 2);
    text(ax, 10, base_turb, '\leftarrow Ref Turbidity', 'VerticalAlignment', 'bottom', 'Color', [0 0 0], 'FontSize', 8);
     
    % --- SETUP LIVE LINES (Solid, Colored, Thick) ---
    c = colors(fn);
    
    % Live Conductivity (Solid color)
    lines_cond(fn) = animatedline(ax, 'Color', c, 'LineWidth', 2.5);
    
    % Live Turbidity (Color with marker to distinguish from conductivity)
    lines_turb(fn) = animatedline(ax, 'Color', c * 0.6, 'LineWidth', 1.5, 'LineStyle', '-', 'Marker', '.');
    
    legend(ax, [lines_cond(fn), lines_turb(fn)], {'Live Cond', 'Live Turb'}, 'Location', 'northwest');
end

processed_lines = 0;
disp('Tracking separate factories... Press Ctrl+C to stop.');

% === LOOP ===
while true
    try
        if ~isfile(data_file)
            pause(1); continue;
        end

        % Robust Read
        opts = detectImportOptions(data_file);
        opts.SelectedVariableNames = {'factory_id', 'turbidity_ntu', 'conductivity_us_cm'};
        opts = setvaropts(opts, 'factory_id', 'Type', 'string');
        opts = setvaropts(opts, {'turbidity_ntu', 'conductivity_us_cm'}, 'Type', 'double');
        warning('off', 'MATLAB:table:ModifiedAndSavedVarnames');
        
        T = readtable(data_file, opts);
        num_rows = height(T);
        
        if num_rows > processed_lines
            new_T = T(processed_lines+1:end, :);
            
            % Process each row
            for r = 1:height(new_T)
                raw_fid = char(new_T.factory_id(r));
                
                % Convert CH-1 -> CH_1 to match keys
                if isKey(csv_map, raw_fid)
                    fid = csv_map(raw_fid);
                else
                    continue; 
                end
                
                if ~isKey(axes_list, fid)
                    continue;
                end
                
                % Get data
                val_cond = new_T.conductivity_us_cm(r);
                val_turb = new_T.turbidity_ntu(r);
                
                % Global X index (approximate time)
                x_idx = processed_lines + r;
                
                % Update Lines
                addpoints(lines_cond(fid), x_idx, val_cond);
                addpoints(lines_turb(fid), x_idx, val_turb);
                
                % Auto-scroll X-axis (keep last 50 points mostly visible roughly)
                ax = axes_list(fid);
                if x_idx > 50
                    xlim(ax, [x_idx-50, x_idx+10]);
                else
                    xlim(ax, [0, 60]);
                end
            end
            
            processed_lines = num_rows;
            drawnow limitrate;
        end
        pause(0.5); % Faster update
    catch ME
        disp(['Error: ' ME.message]);
        pause(1);
    end
end
